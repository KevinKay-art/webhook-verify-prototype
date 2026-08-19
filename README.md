# Webhook Verification Prototype

## Overview

This is a small Node.js prototype created to explore how webhook requests can be received and verified before they are processed.

The main focus of the prototype is understanding how a webhook can use a shared secret and signature to determine whether an incoming request is valid.

## Objective

The objective of this prototype was to learn and demonstrate the basic webhook verification process through a working implementation.

## How It Works

The prototype follows this basic flow:

1. A webhook request is received by the server.
2. The request payload and signature are read.
3. The signature is verified using the shared secret.
4. A valid request is accepted and processed.
5. An invalid request is rejected.

## Technologies Used

* Node.js
* JavaScript
* HTTP
* HMAC-SHA256

## Project Files

* `server.js` – runs the webhook server and handles verification.
* `test-client.js` – sends test webhook requests to check the verification process.
* `package.json` – contains the project configuration and available commands.

## Running the Prototype

### 1. Install dependencies

```bash
npm install
```

### 2. Start the webhook server

```bash
npm start
```

The server will listen for incoming webhook requests.

### 3. Run the tests

In another terminal:

```bash
npm run test:webhook
```

The test client sends different webhook requests to demonstrate how the verification behaves.

## Testing

The prototype tests different scenarios, including:

* A valid webhook signature.
* A tampered request body.
* An incorrect secret/signature.
* A request without the required signature.

These tests help demonstrate that the server does not automatically trust every incoming webhook request.

## Limitations

This is a learning prototype rather than a production-ready webhook management system.

It focuses on the core verification process and does not currently include features such as persistent event storage, a monitoring dashboard, or multiple webhook-provider integrations.

## Future Improvements

Possible future improvements include:

* Persistent storage of webhook events.
* More automated tests.
* Support for additional webhook providers.
* Improved logging and monitoring.

## Learning Outcome

This prototype was built to gain practical experience with webhook requests, request signatures, and verification logic.
