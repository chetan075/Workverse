-- AlterTable
ALTER TABLE `invoice` ADD COLUMN `onchainTxHash` VARCHAR(191) NULL,
    ADD COLUMN `tokenId` BIGINT NULL;
