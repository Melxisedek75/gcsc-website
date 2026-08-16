const PUBLIC_SECRET_PATTERNS = [
  {
    type: 'supabase-service-role-key',
    pattern: /["']?SUPABASE[_-]?SERVICE[_-]?ROLE[_-]?KEY["']?\s*[:=]\s*["']?[A-Za-z0-9+/_-]{12,}/gi,
  },
  {
    type: 'service-role-key-assignment',
    pattern: /["']?SERVICE[_-]?ROLE[_-]?KEY["']?\s*[:=]\s*["']?[A-Za-z0-9+/_-]{12,}/gi,
  },
  {
    type: 'private-key-assignment',
    pattern: /["']?PRIVATE[_-]?KEY["']?\s*[:=]\s*["']?[A-Za-z0-9+/_-]{12,}/gi,
  },
  {
    type: 'seed-phrase-assignment',
    pattern: /["']?SEED(?:[_-]|\s)+PHRASE["']?\s*[:=]\s*["']?[A-Za-z0-9+/_-]{12,}/gi,
  },
  {
    type: 'database-password-assignment',
    pattern: /["']?(?:DB|DATABASE)(?:[_-]|\s)+PASSWORD["']?\s*[:=]\s*["']?[A-Za-z0-9+/_-]{12,}/gi,
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
  const occupiedRanges = [];

  for (const { type, pattern } of PUBLIC_SECRET_PATTERNS) {
    for (const match of text.matchAll(pattern)) {
      const index = match.index;
      const end = index + match[0].length;
      const overlapsExistingFinding = occupiedRanges.some((range) => (
        index < range.end && range.start < end
      ));

      if (overlapsExistingFinding) continue;

      occupiedRanges.push({ start: index, end });
      findings.push({
        type,
        index,
        line: lineNumberAt(text, index),
      });
    }
  }

  return findings.sort((left, right) => left.index - right.index);
}
