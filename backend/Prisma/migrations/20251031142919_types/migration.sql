/*
  Warnings:

  - The primary key for the `invoice` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `user` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `valuelink` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE `invoice` DROP FOREIGN KEY `Invoice_clientId_fkey`;

-- DropForeignKey
ALTER TABLE `invoice` DROP FOREIGN KEY `Invoice_freelancerId_fkey`;

-- DropForeignKey
ALTER TABLE `valuelink` DROP FOREIGN KEY `ValueLink_fromUserId_fkey`;

-- DropForeignKey
ALTER TABLE `valuelink` DROP FOREIGN KEY `ValueLink_toUserId_fkey`;

-- DropIndex
DROP INDEX `Invoice_clientId_fkey` ON `invoice`;

-- DropIndex
DROP INDEX `Invoice_freelancerId_fkey` ON `invoice`;

-- DropIndex
DROP INDEX `ValueLink_fromUserId_fkey` ON `valuelink`;

-- DropIndex
DROP INDEX `ValueLink_toUserId_fkey` ON `valuelink`;

-- AlterTable
ALTER TABLE `invoice` DROP PRIMARY KEY,
    MODIFY `id` VARCHAR(191) NOT NULL,
    MODIFY `clientId` VARCHAR(191) NULL,
    MODIFY `freelancerId` VARCHAR(191) NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `user` DROP PRIMARY KEY,
    MODIFY `id` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `valuelink` DROP PRIMARY KEY,
    MODIFY `id` VARCHAR(191) NOT NULL,
    MODIFY `fromUserId` VARCHAR(191) NOT NULL,
    MODIFY `toUserId` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AddForeignKey
ALTER TABLE `Invoice` ADD CONSTRAINT `Invoice_clientId_fkey` FOREIGN KEY (`clientId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Invoice` ADD CONSTRAINT `Invoice_freelancerId_fkey` FOREIGN KEY (`freelancerId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ValueLink` ADD CONSTRAINT `ValueLink_fromUserId_fkey` FOREIGN KEY (`fromUserId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ValueLink` ADD CONSTRAINT `ValueLink_toUserId_fkey` FOREIGN KEY (`toUserId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
