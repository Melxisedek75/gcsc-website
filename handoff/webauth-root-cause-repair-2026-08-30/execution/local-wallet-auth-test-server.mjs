import { randomUUID } from 'node:crypto';
import { createServer } from 'node:http';
import { pathToFileURL } from 'node:url';
import { resolve } from 'node:path';

const HOST = '127.0.0.1';
const XPR_TESTNET_CHAIN_ID = '71ee83bcf52142d61019d95f9cc5427ba6a0d7ff8accd9e2088ae2abeaf3d3dd';
const MAX_BODY_BYTES = 16 * 1024;

function sendJson(response, status, body) {
  response.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
  });
  response.end(JSON.stringify(body));
}

async function readJson(request) {
  let size = 0;
  const chunks = [];
  for await (const chunk of request) {
    size += chunk.length;
    if (size > MAX_BODY_BYTES) throw new Error('request body too large');
    chunks.push(chunk);
  }
  const body = Buffer.concat(chunks).toString('utf8');
  return body ? JSON.parse(body) : {};
}

function isAntelopeName(value) {
  return typeof value === 'string' && /^[a-z1-5.]{1,12}$/.test(value);
}

export async function createLocalWalletAuthTestServer({ port = 10000 } = {}) {
  const server = createServer(async (request, response) => {
    if (request.method === 'GET' && request.url === '/health') {
      sendJson(response, 200, { ok: true, mode: 'local-wallet-auth-test-only' });
      return;
    }

    if (request.method === 'POST' && request.url === '/api/auth/wallet/challenge') {
      try {
        const { accountName, permission } = await readJson(request);
        if (!isAntelopeName(accountName) || !isAntelopeName(permission)) {
          sendJson(response, 400, { code: 'invalid_wallet_identity', error: 'Invalid wallet account or permission.' });
          return;
        }
        const requestId = randomUUID();
        sendJson(response, 200, {
          requestId,
          message: `LOCAL-ONLY TEST: SmartContractor wallet check ${requestId}`,
          chainId: XPR_TESTNET_CHAIN_ID,
          accountName,
          permission,
          expiresAt: Date.now() + 5 * 60 * 1000,
        });
      } catch {
        sendJson(response, 400, { code: 'invalid_json', error: 'Invalid JSON request body.' });
      }
      return;
    }

    if (request.method === 'POST' && request.url === '/api/auth/wallet/verify') {
      sendJson(response, 501, {
        code: 'local_verification_disabled',
        error: 'Local test mode stops before wallet-proof verification.',
      });
      return;
    }

    sendJson(response, 404, { code: 'not_found', error: 'Route not found.' });
  });

  await new Promise((resolveServer, reject) => {
    server.once('error', reject);
    server.listen(port, HOST, () => {
      server.off('error', reject);
      resolveServer();
    });
  });

  const address = server.address();
  if (!address || typeof address === 'string') throw new Error('Local test server did not expose a TCP address');
  return {
    url: `http://${HOST}:${address.port}`,
    close: () => new Promise((resolveClose, reject) => server.close((error) => error ? reject(error) : resolveClose())),
  };
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const port = Number.parseInt(process.env.SMARTCONTRACTOR_LOCAL_AUTH_PORT ?? '10000', 10);
  const service = await createLocalWalletAuthTestServer({ port });
  console.log(`SmartContractor local wallet-auth test server listening at ${service.url}`);
}
