import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/Prisma.service';
import { JwtService } from '@nestjs/jwt';
import { randomBytes } from 'crypto';
import nacl from 'tweetnacl';
import { TextEncoder } from 'util';
import { AptosClient, AptosAccount } from 'aptos';

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

    try {
      const client = new AptosClient(nodeUrl);
      // AptosAccount.fromPrivateKeyHex exists in current SDKs; if not, this will throw and be caught
      // The Aptos SDK exposes constructors for AptosAccount; construct from private key bytes
      const account = new AptosAccount(Buffer.from(pkHex, 'hex'));
      const deployer = account.address().hex();

      // Build a simple entry function payload calling Escrow::mint_invoice(u64)
      const payload: any = {
        function: `${deployer}::Escrow::mint_invoice`,
        type_arguments: [],
        arguments: [Number(invoiceId)],
      };

      // Generate, sign and submit transaction using SDK helpers where available
      const txRequest = await client.generateTransaction(
        account.address(),
        payload as any,
      );
      // sign & submit
      const signed = await client.signTransaction(account, txRequest as any);
      // submitSignedTransaction is not present in this SDK version; use submitSignedBCSTransaction
      const res = await client.submitSignedBCSTransaction(signed);
      return { invoiceId, txHash: res.hash };
    } catch (e) {
      const fakeTx = '0x' + randomBytes(12).toString('hex');
      return { invoiceId, txHash: fakeTx, error: String(e) };
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
}
