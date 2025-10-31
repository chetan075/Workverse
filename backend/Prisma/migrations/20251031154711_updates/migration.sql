-- AlterTable
ALTER TABLE `invoice` ADD COLUMN `releasedAt` DATETIME(3) NULL,
    ADD COLUMN `stripePaymentIntentId` VARCHAR(191) NULL,
    MODIFY `status` ENUM('DRAFT', 'SENT', 'PAID', 'RELEASED') NOT NULL DEFAULT 'DRAFT';
