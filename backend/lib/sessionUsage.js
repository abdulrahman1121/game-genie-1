// In-memory per-session usage counters, keyed by the session token's nonce.
// Entries carry the token's own expiresAt, so a periodic sweep can evict them once the
// session itself has gone stale -- no separate TTL bookkeeping needed.
const usage = new Map(); // nonce -> { counts: { [routeKey]: number }, expiresAt: number }

function getEntry(nonce, expiresAt) {
  let entry = usage.get(nonce);
  if (!entry) {
    entry = { counts: {}, expiresAt };
    usage.set(nonce, entry);
  }
  return entry;
}

function checkAndIncrement(nonce, expiresAt, routeKey, limit) {
  const entry = getEntry(nonce, expiresAt);
  const nextCount = (entry.counts[routeKey] || 0) + 1;
  if (nextCount > limit) {
    return { allowed: false, count: nextCount - 1 };
  }
  entry.counts[routeKey] = nextCount;
  return { allowed: true, count: nextCount };
}

function sweepExpired(now = Date.now()) {
  for (const [nonce, entry] of usage) {
    if (entry.expiresAt < now) usage.delete(nonce);
  }
}

// .unref() keeps this from holding the process (or a test run) open.
setInterval(sweepExpired, 5 * 60 * 1000).unref();

module.exports = { checkAndIncrement, sweepExpired, _usage: usage };
