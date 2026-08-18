const express = require('express');
const crypto = require('crypto');

const app = express();
const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET || 'my-shared-secret-123';const PORT = 3000;
 // in real life: env var, never hardcoded

// // Keep the raw request body for signature verification.
app.use(express.raw({ type: 'application/json' }));

function verifySignature(rawBody, signatureHeader, secret) {
  if (!signatureHeader) return false;

  const expected = crypto
    .createHmac('sha256', secret)
    .update(rawBody)
    .digest('hex');

  const expectedBuf = Buffer.from(`sha256=${expected}`);
  const providedBuf = Buffer.from(signatureHeader);

// timingSafeEqual requires buffers of the same length.
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

// Process the payload only after verification.
  res.status(200).json({ received: true });
});

app.listen(PORT, () => {
  console.log(`Webhook receiver listening on port ${PORT}`);
});
