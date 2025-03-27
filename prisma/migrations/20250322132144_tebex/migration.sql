/*
  Warnings:

  - You are about to drop the column `fivemUsername` on the `user` table. All the data in the column will be lost.
  - You are about to drop the `license` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `license` DROP FOREIGN KEY `License_orderId_fkey`;

-- DropForeignKey
ALTER TABLE `license` DROP FOREIGN KEY `License_userId_fkey`;

-- AlterTable
ALTER TABLE `news` ALTER COLUMN `date` DROP DEFAULT;

-- AlterTable
ALTER TABLE `order` ADD COLUMN `tebexClaimCode` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `user` DROP COLUMN `fivemUsername`;

-- DropTable
DROP TABLE `license`;
