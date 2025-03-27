-- AlterTable
ALTER TABLE `news` ALTER COLUMN `date` DROP DEFAULT;

-- AlterTable
ALTER TABLE `user` ADD COLUMN `admin` BOOLEAN NOT NULL DEFAULT false;
