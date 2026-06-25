#!/usr/bin/env node
/**
 * Taskade REST API wrapper for GCSC Command Center.
 *
 * Why this exists: the official Taskade MCP (hosted) is effectively READ-ONLY
 * for boards — it refuses writes under projects/ ("write operations are not
 * allowed under projects/"). To edit docs/tasks without a browser we use the
 * REST API v1 directly. This CLI is that bridge.
 *
 * Auth: reads TASKADE_API_KEY (Personal Access Token, tskdp_...) from .env.
 *
 * Usage (run from C:\gcsc):
 *   node execution/taskade.js spaces                         list workspaces
 *   node execution/taskade.js projects <workspaceId>         list projects in a workspace
 *   node execution/taskade.js tasks <projectId>              list tasks of a project (id + text)
 *   node execution/taskade.js get-task <projectId> <taskId>  read one task
 *   node execution/taskade.js set-task <projectId> <taskId> "<new text>"   replace task text
 *
 * Notes:
 *  - set-task sends {content, contentType:"text/plain"} (the combo the API requires).
 *  - JSON bodies are built with JSON.stringify, so backslashes/quotes are safe.
 */
'use strict';

const fs = require('fs');
const path = require('path');

const BASE = 'https://www.taskade.com/api/v1';

function loadToken() {
  const envPath = path.resolve(__dirname, '..', '.env');
  let token = process.env.TASKADE_API_KEY;
  if (!token && fs.existsSync(envPath)) {
    const line = fs
      .readFileSync(envPath, 'utf8')
      .split(/\r?\n/)
      .find((l) => l.startsWith('TASKADE_API_KEY='));
    if (line) token = line.slice('TASKADE_API_KEY='.length).trim();
  }
  if (!token) {
    console.error('ERROR: TASKADE_API_KEY not found (env or .env).');
    process.exit(1);
  }
  return token;
}

async function api(method, endpoint, body) {
  const token = loadToken();
  const res = await fetch(`${BASE}${endpoint}`, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    data = text;
  }
  if (!res.ok) {
    console.error(`HTTP ${res.status} on ${method} ${endpoint}`);
    console.error(typeof data === 'string' ? data : JSON.stringify(data, null, 2));
    process.exit(1);
  }
  return data;
}

async function main() {
  const [cmd, a, b, c] = process.argv.slice(2);
  switch (cmd) {
    case 'spaces': {
      const d = await api('GET', '/workspaces');
      console.log(JSON.stringify(d.items || d, null, 2));
      break;
    }
    case 'projects': {
      if (!a) return usage();
      const d = await api('GET', `/workspaces/${a}/projects`);
      console.log(JSON.stringify(d.items || d, null, 2));
      break;
    }
    case 'tasks': {
      if (!a) return usage();
      const d = await api('GET', `/projects/${a}/tasks`);
      (d.items || []).forEach((t) =>
        console.log(`${t.id}\t${(t.text || '').replace(/\n/g, ' ')}`)
      );
      break;
    }
    case 'get-task': {
      if (!a || !b) return usage();
      const d = await api('GET', `/projects/${a}/tasks/${b}`);
      console.log(JSON.stringify(d.item || d, null, 2));
      break;
    }
    case 'set-task': {
      if (!a || !b || c === undefined) return usage();
      await api('PUT', `/projects/${a}/tasks/${b}`, {
        content: c,
        contentType: 'text/plain',
      });
      const d = await api('GET', `/projects/${a}/tasks/${b}`);
      console.log('OK ->', (d.item && d.item.text) || '(updated)');
      break;
    }
    default:
      usage();
  }
}

function usage() {
  console.log(
    [
      'Usage:',
      '  node execution/taskade.js spaces',
      '  node execution/taskade.js projects <workspaceId>',
      '  node execution/taskade.js tasks <projectId>',
      '  node execution/taskade.js get-task <projectId> <taskId>',
      '  node execution/taskade.js set-task <projectId> <taskId> "<new text>"',
    ].join('\n')
  );
  process.exit(1);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
