const express = require('express');
const crypto = require('crypto');

const app = express();
const PORT = 3000;
const WEBHOOK_SECRET = 'my-shared-secret-123'; // in real life: env var, never hardcoded

// CRITICAL: we need the RAW body bytes to verify the signature, not the
// parsed JSON. If you use express.json() alone, by the time you see
// req.body it's already been parsed and re-stringifying it won't
// necessarily match the bytes the sender actually signed.
app.use(express.raw({ type: 'application/json' }));

function verifySignature(rawBody, signatureHeader, secret) {
  if (!signatureHeader) return false;

  const expected = crypto
    .createHmac('sha256', secret)
    .update(rawBody)
    .digest('hex');

  const expectedBuf = Buffer.from(`sha256=${expected}`);
  const providedBuf = Buffer.from(signatureHeader);

  // Buffers must be equal length for timingSafeEqual, so check that first.
  // This length check itself doesn't leak anything useful to an attacker.
  if (expectedBuf.length !== providedBuf.length) return false;

  return crypto.timingSafeEqual(expectedBuf, providedBuf);
}

app.post('/webhook', (req, res) => {
  const signature = req.headers['x-hub-signature-256'];
  const rawBody = req.body; // Buffer, thanks to express.raw()

  const isValid = verifySignature(rawBody, signature, WEBHOOK_SECRET);

  if (!isValid) {
    console.log('[REJECTED] Invalid or missing signature');
    return res.status(401).json({ error: 'Invalid signature' });
  }

  const payload = JSON.parse(rawBody.toString('utf8'));
  console.log('[ACCEPTED] Verified webhook:', payload);

  // Only NOW, after verification, do we trust and act on the payload
  res.status(200).json({ received: true });
});

app.listen(PORT, () => {
  console.log(`Webhook receiver listening on port ${PORT}`);
});
