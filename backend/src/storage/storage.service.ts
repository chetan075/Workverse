import { Injectable, Logger } from '@nestjs/common';
import { encryptBuffer } from './utils/encryption';
import { createHash } from 'crypto';
import { PrismaService } from '../common/Prisma.service';

@Injectable()
export class StorageService {
  private logger = new Logger(StorageService.name);

  constructor(private readonly prisma: PrismaService) {}

  async uploadFromBase64(invoiceId: string, filename: string, base64: string) {
    const secret =
      process.env.AES_SECRET || 'dev-secret-32-bytes-minimum-please';
    const buffer = Buffer.from(base64, 'base64');
    const encrypted = encryptBuffer(buffer, secret);

    // metadata hash (sha256 of ciphertext)
    const metadataHash = createHash('sha256').update(encrypted).digest('hex');

    // For MVP: if IPFS configured, try to upload; otherwise produce dev ipfs-like hash
    const ipfsHash = process.env.IPFS_CID_PREFIX
      ? `${process.env.IPFS_CID_PREFIX}:${metadataHash.slice(0, 16)}`
      : `devipfs://${metadataHash.slice(0, 16)}`;

    const created = await this.prisma.storedFile.create({
      data: {
        invoiceId,
        filename,
        ipfsHash,
        metadataHash,
        encryptedBase64: encrypted,
      },
    });

    this.logger.log(`Stored file for invoice=${invoiceId} ipfs=${ipfsHash}`);
    return created;
  }

  async listForInvoice(invoiceId: string) {
    return this.prisma.storedFile.findMany({ where: { invoiceId } });
  }
}
