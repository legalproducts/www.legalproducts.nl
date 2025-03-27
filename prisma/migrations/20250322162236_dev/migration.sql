/*
  Warnings:

  - A unique constraint covering the columns `[tebexOrderId]` on the table `Order` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[stripeSessionId]` on the table `Order` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `news` ALTER COLUMN `date` DROP DEFAULT;

-- AlterTable
ALTER TABLE `order` ADD COLUMN `stripeSessionId` VARCHAR(191) NULL,
    ADD COLUMN `tebexOrderId` VARCHAR(191) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Order_tebexOrderId_key` ON `Order`(`tebexOrderId`);

-- CreateIndex
CREATE UNIQUE INDEX `Order_stripeSessionId_key` ON `Order`(`stripeSessionId`);
