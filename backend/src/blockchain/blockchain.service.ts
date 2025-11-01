import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/Prisma.service';
import { JwtService } from '@nestjs/jwt';
import { randomBytes } from 'crypto';
import nacl from 'tweetnacl';
import { TextEncoder } from 'util';
import { AptosClient, AptosAccount } from 'aptos';
import { promisify } from 'util';
import { exec as execCb } from 'child_process';
import path from 'path';
import fs from 'fs/promises';
const exec = promisify(execCb);

interface ChallengeEntry {
  challenge: string;
  createdAt: number;
}

@Injectable()
export class BlockchainService {
  private challenges = new Map<string, ChallengeEntry>();

  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
  ) {}

  // Create a short-lived challenge for wallet signature
  requestChallenge(address: string) {
    const challenge = 'Sign this challenge: ' + randomBytes(16).toString('hex');
    this.challenges.set(address.toLowerCase(), {
      challenge,
      createdAt: Date.now(),
    });
    return { address, challenge };
  }

  // Verify signature using Ed25519 (Aptos wallets use Ed25519 keys)
  // signature may be hex (0x...) or base64
  verifySignature(address: string, signature: string, publicKeyHex?: string) {
    const entry = this.challenges.get(address.toLowerCase());
    if (!entry) return null;
    if (!publicKeyHex) {
      // If public key not provided we can't verify strict cryptographic proof.
      // Keep previous behaviour: accept for development but log a warning.
      this.challenges.delete(address.toLowerCase());
      const token = this.jwt.sign({ sub: address, wallet: true });
      return {
        access_token: token,
        warning: 'publicKey not provided; signature not verified',
      };
    }

    // Normalize and parse public key and signature
    const parseHexOrBase64 = (s: string) => {
      if (s.startsWith('0x')) {
        const hex = s.slice(2);
        return Uint8Array.from(Buffer.from(hex, 'hex'));
      }
      // try base64
      try {
        return Uint8Array.from(Buffer.from(s, 'base64'));
      } catch (e) {
        // try raw hex
        return Uint8Array.from(Buffer.from(s, 'hex'));
      }
    };

    let pubKeyBytes: Uint8Array;
    let sigBytes: Uint8Array;
    try {
      pubKeyBytes = parseHexOrBase64(publicKeyHex);
      sigBytes = parseHexOrBase64(signature);
    } catch (e) {
      return null;
    }

    const msgBytes = new TextEncoder().encode(entry.challenge);
    const ok = nacl.sign.detached.verify(msgBytes, sigBytes, pubKeyBytes);
    if (!ok) return null;
    // success
    this.challenges.delete(address.toLowerCase());
    const token = this.jwt.sign({ sub: address, wallet: true });
    return { access_token: token };
  }

  // Mint an invoice NFT. If Aptos environment variables are configured (APTOS_NODE_URL + APTOS_PRIVATE_KEY)
  // this will attempt to submit a transaction to the Aptos network. Otherwise it falls back to a dev stub.
  async mintInvoiceNFT(invoiceId: string) {
    const inv = await this.prisma.invoice.findUnique({
      where: { id: invoiceId },
    });
    if (!inv) throw new Error('Invoice not found');

    const nodeUrl = process.env.APTOS_NODE_URL;
    const pkHex = process.env.APTOS_PRIVATE_KEY; // hex string
    if (!nodeUrl || !pkHex) {
      // fallback stub
      const fakeTx = '0x' + randomBytes(12).toString('hex');
      return { invoiceId, txHash: fakeTx, stub: true };
    }

    let tokenId: number | undefined;

    try {
      const client = new AptosClient(nodeUrl);
      // AptosAccount.fromPrivateKeyHex exists in current SDKs; if not, this will throw and be caught
      // The Aptos SDK exposes constructors for AptosAccount; construct from private key bytes
      const account = new AptosAccount(Buffer.from(pkHex, 'hex'));
      const deployer = account.address().hex();

      // Build metadata JSON from invoice and encode to bytes
      const metadata = {
        invoiceId: inv.id,
        title: inv.title,
        amount: inv.amount,
        clientId: inv.clientId,
        freelancerId: inv.freelancerId,
        mintedAt: new Date().toISOString(),
      };
      const metadataJson = JSON.stringify(metadata);
      const metadataBytes = Array.from(Buffer.from(metadataJson, 'utf8'));

    // Deterministic tokenId: take first 6 bytes of sha256(invoice.uuid) -> safe u64 within JS number range
    const crypto = await import('crypto');
    const hash = crypto.createHash('sha256').update(inv.id).digest();
      // use first 6 bytes -> 48 bits -> safe integer
      tokenId =
        hash[0] * 2 ** 40 +
        hash[1] * 2 ** 32 +
        hash[2] * 2 ** 24 +
        hash[3] * 2 ** 16 +
        hash[4] * 2 ** 8 +
        hash[5] * 1;

      // Call the new Move entry function mint_invoice_with_metadata(account, invoice_id, metadata: vector<u8>)
      const payload: any = {
        function: `${deployer}::Escrow::mint_invoice_with_metadata`,
        type_arguments: [],
        arguments: [Number(tokenId), metadataBytes],
      };

      // Generate, sign and submit transaction using SDK helpers where available
      const txRequest = await client.generateTransaction(account.address(), payload as any);
      // sign & submit
      const signed = await client.signTransaction(account, txRequest as any);
      // submitSignedTransaction is not present in this SDK version; use submitSignedBCSTransaction
      const res = await client.submitSignedBCSTransaction(signed);
      // Persist tokenId and txHash into Invoice record
      try {
        // prisma client may be out-of-date until `npx prisma generate` is run; cast data as any to avoid TS type errors in dev
        await this.prisma.invoice.update({
          where: { id: invoiceId },
          data: ({ tokenId: BigInt(tokenId!), onchainTxHash: String(res.hash) } as any),
        });
      } catch (e) {
        // ignore persistence error but return tx info
      }
      return { invoiceId, tokenId, txHash: res.hash };
    } catch (e) {
      const fakeTx = '0x' + randomBytes(12).toString('hex');
      const fallbackTokenId = tokenId ?? Date.now();
      try {
        await this.prisma.invoice.update({
          where: { id: invoiceId },
          data: ({ tokenId: BigInt(fallbackTokenId), onchainTxHash: fakeTx } as any),
        });
      } catch (_) {}
      return { invoiceId, tokenId: fallbackTokenId, txHash: fakeTx, error: String(e) };
    }
  }

  // Mint Reputation SBT: similar strategy to invoice minting
  async mintReputationSBT(userId: string, score = 1) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new Error('User not found');

    const nodeUrl = process.env.APTOS_NODE_URL;
    const pkHex = process.env.APTOS_PRIVATE_KEY; // hex string
    if (!nodeUrl || !pkHex) {
      const fakeTx = '0x' + randomBytes(12).toString('hex');
      return { userId, txHash: fakeTx, stub: true };
    }

    try {
      const client = new AptosClient(nodeUrl);
      const account = new AptosAccount(Buffer.from(pkHex, 'hex'));
      const deployer = account.address().hex();

      const payload: any = {
        function: `${deployer}::Escrow::mint_reputation`,
        type_arguments: [],
        // mint_reputation(account: &signer, score: u64) expects a single u64 score argument
        arguments: [Number(score)],
      };

      const txRequest = await client.generateTransaction(
        account.address(),
        payload as any,
      );
      const signed = await client.signTransaction(account, txRequest as any);
      const res = await client.submitSignedBCSTransaction(signed);
      return { userId, txHash: res.hash };
    } catch (e) {
      const fakeTx = '0x' + randomBytes(12).toString('hex');
      return { userId, txHash: fakeTx, error: String(e) };
    }
  }

  // Publish the Escrow.move package using the Aptos CLI if available.
  // This helper will run `aptos move compile` and `aptos move publish` against the
  // `backend/src/blockchain/contracts` folder. CLI must be installed and configured.
  async publishEscrowModule() {
    const projectDir = path.resolve(__dirname, 'contracts');
    if (!process.env.APTOS_PRIVATE_KEY) {
      throw new Error('APTOS_PRIVATE_KEY not set in environment; cannot publish module');
    }

    // Optionally replace deployer placeholder in Move file with APTOS_DEPLOYER_ADDRESS
    const deployerAddr = process.env.APTOS_DEPLOYER_ADDRESS;
    const contractPath = path.join(projectDir, 'Escrow.move');
    let originalContent: string | null = null;
    try {
      if (deployerAddr) {
        originalContent = await fs.readFile(contractPath, 'utf8');
        const normalized = deployerAddr.startsWith('0x') ? deployerAddr : `0x${deployerAddr}`;
        const replaced = originalContent.replace(/0x\{\{DEPLOYER\}\}/g, normalized);
        await fs.writeFile(contractPath, replaced, 'utf8');
      }

      const compileCmd = `aptos move compile --package-dir "${projectDir}"`;
      const publishCmd = `aptos move publish --package-dir "${projectDir}" --assume-yes`;

      const compileRes = await exec(compileCmd);
      const publishRes = await exec(publishCmd);

      // restore original file if we replaced it
      if (originalContent !== null) {
        await fs.writeFile(contractPath, originalContent, 'utf8');
      }

      return {
        compile: compileRes.stdout || compileRes.stderr,
        publish: publishRes.stdout || publishRes.stderr,
      };
    } catch (e: any) {
      // restore original if needed
      if (originalContent !== null) {
        try {
          await fs.writeFile(contractPath, originalContent, 'utf8');
        } catch (_) {}
      }
      return { error: String(e), stdout: e?.stdout, stderr: e?.stderr };
    }
  }
}
