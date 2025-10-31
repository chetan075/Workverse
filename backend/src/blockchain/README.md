Aptos / Move integration notes

This folder contains a minimal Move contract `Escrow.move` and a NestJS `BlockchainService` that:

- issues wallet signature challenges
- verifies Ed25519 signatures (using `tweetnacl`)
- when `APTOS_NODE_URL` and `APTOS_PRIVATE_KEY` env vars are set, attempts to submit transactions to Aptos
- otherwise falls back to returning a fake tx hash for dev

Setup

1. Install dependencies in `backend`:

   npm install

2. Add environment variables (example `.env`):

   APTOS_NODE_URL=https://fullnode.devnet.aptoslabs.com
   APTOS_PRIVATE_KEY=<hex-encoded private key for deployer, no 0x prefix>

3. Publish the Move module using the Aptos CLI or SDK. Replace the placeholder address in `Escrow.move` with your deployer address before publishing.

Quick flows

- Request challenge: POST /blockchain/auth/request-challenge { address }
- Verify: POST /blockchain/auth/verify { address, signature, publicKey }
- Mint invoice: POST /blockchain/mint-invoice/:invoiceId (requires JWT from verify)

Notes

- `Escrow.move` is a minimal, example-only contract and not a production NFT implementation. Use standard token modules for production.
- If you want automated publishing from the backend (publish Move module via SDK), ask me and I can add a deploy helper that publishes the module from `APTOS_PRIVATE_KEY`.
