const PUBLIC_SECRET_PATTERNS = [
  {
    type: 'service-role-key-assignment',
    pattern: /(?:["']SERVICE[_-]?ROLE(?:[_-]?KEY)?["']|\bSERVICE[_-]?ROLE(?:[_-]?KEY)?\b)\s*[:=]\s*\S{12,}/gi,
  },
  {
    type: 'private-key-assignment',
    pattern: /(?:["']PRIVATE[_-]?KEY["']|\bPRIVATE[_-]?KEY\b)\s*[:=]\s*\S{12,}/gi,
  },
  {
    type: 'seed-phrase-assignment',
    pattern: /(?:["']SEED(?:[_-]|\s)+PHRASE["']|\bSEED(?:[_-]|\s)+PHRASE\b)\s*[:=]\s*\S{12,}/gi,
  },
  {
    type: 'database-password-assignment',
    pattern: /(?:["'](?:DB|DATABASE)(?:[_-]|\s)+PASSWORD["']|\b(?:DB|DATABASE)(?:[_-]|\s)+PASSWORD\b)\s*[:=]\s*\S{12,}/gi,
  },
  {
    type: 'supabase-service-role-key',
    pattern: /\bSUPABASE_SERVICE_ROLE_KEY\s*=\s*sbp_[A-Za-z0-9_-]{20,}\b/g,
  },
  {
    type: 'stripe-live-secret-key',
    pattern: /\bsk_live_[A-Za-z0-9]{20,}\b/g,
  },
  {
    type: 'jwt',
    pattern: /\beyJ[A-Za-z0-9_-]{17,}\.[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\b/g,
  },
  {
    type: 'pem-private-key',
    pattern: /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/g,
  },
];

function lineNumberAt(text, index) {
  return text.slice(0, index).split('\n').length;
}

export function findPublicSecretFindings(text) {
  const findings = [];

  for (const { type, pattern } of PUBLIC_SECRET_PATTERNS) {
    for (const match of text.matchAll(pattern)) {
      findings.push({
        type,
        index: match.index,
        line: lineNumberAt(text, match.index),
      });
    }
  }

  return findings.sort((left, right) => left.index - right.index);
}
