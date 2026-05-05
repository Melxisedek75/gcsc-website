import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const docs = [
  {
    path: resolve('..', 'docs', 'smartcontractor-smart-contract-design.md'),
    required: [
      'Not legal advice',
      'Do not store raw private documents',
      'attorney and compliance review',
      'Project Escrow Contract',
      'Contractor Loan Ledger Contract',
      'Token Collateral',
      'Peer Review',
      'milestone',
      'audit_events',
    ],
    forbidden: [
      'guaranteed profit',
      'guaranteed returns',
      'automatic legal approval',
      'GCSC is a licensed escrow',
      'SmartContractor is a licensed escrow',
    ],
  },
  {
    path: resolve('..', 'docs', 'smartcontractor-loan-legal-risk-model.md'),
    required: [
      'not final legal advice',
      'licensed attorney',
      'Security Interest',
      'Platform Repayment Priority',
      'Fraud And Bad Intent Certification',
      'GCSC should not promise that tokens will increase in price',
      'no guarantee of token price growth',
    ],
    forbidden: [
      'the contractor company automatically belongs to GCSC',
      'guaranteed token growth',
      'guaranteed loan approval',
    ],
  },
  {
    path: resolve('..', 'docs', 'upwork-research-smartcontractor-disputes.md'),
    required: [
      'independent contractor peer review',
      'photos',
      'videos',
      'onsite inspection',
      'token rewards',
      'Future Smart Contract Layer',
      'evidence hash stored on-chain',
    ],
    forbidden: [
      'automatic final legal decision',
      'guaranteed dispute win',
    ],
  },
];

function fail(message) {
  console.error(`Smart contract design docs validation failed: ${message}`);
  process.exit(1);
}

function assert(condition, message) {
  if (!condition) fail(message);
}

for (const doc of docs) {
  const content = readFileSync(doc.path, 'utf8');
  const normalized = content.toLowerCase();

  for (const phrase of doc.required) {
    assert(
      normalized.includes(phrase.toLowerCase()),
      `${doc.path} is missing required phrase: ${phrase}`
    );
  }

  for (const phrase of doc.forbidden) {
    assert(
      !normalized.includes(phrase.toLowerCase()),
      `${doc.path} contains risky forbidden phrase: ${phrase}`
    );
  }
}

console.log(JSON.stringify({
  status: 'passed',
  docs_checked: docs.map((doc) => doc.path),
}, null, 2));
