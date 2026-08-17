const crypto = require('crypto');

const SECRET = 'my-shared-secret-123';
const URL = 'http://localhost:3000/webhook';

function sign(body, secret) {
  const hmac = crypto.createHmac('sha256', secret).update(body).digest('hex');
  return `sha256=${hmac}`;
}

async function sendRequest(label, body, signature) {
  console.log(`\n--- ${label} ---`);
  const res = await fetch(URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Hub-Signature-256': signature,
    },
    body,
  });
  const data = await res.json();
  console.log('Status:', res.status, 'Response:', data);
}

async function main() {
  const payload = JSON.stringify({ event: 'item.updated', sku: 'SKU-42', stock: 17 });

  // 1. Legit request: correctly signed
  const validSig = sign(payload, SECRET);
  await sendRequest('Case 1: Correctly signed request', payload, validSig);

  // 2. Tampered request: body changed AFTER signing (simulates a
  // man-in-the-middle or someone replaying + editing a captured payload)
  const tamperedPayload = JSON.stringify({ event: 'item.updated', sku: 'SKU-42', stock: 99999 });
  await sendRequest('Case 2: Tampered body, stale signature', tamperedPayload, validSig);

  // 3. No secret known: attacker guesses/fabricates a signature
  const fakeSig = sign(payload, 'wrong-secret-attacker-guess');
  await sendRequest('Case 3: Wrong secret used to sign', payload, fakeSig);

  // 4. Missing signature header entirely
  await sendRequest('Case 4: No signature header sent', payload, '');
}

main();
