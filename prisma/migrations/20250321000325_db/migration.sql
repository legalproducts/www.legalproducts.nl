-- AlterTable
ALTER TABLE `news` MODIFY `description` TEXT NOT NULL,
    ALTER COLUMN `date` DROP DEFAULT,
    ALTER COLUMN `imageUrl` DROP DEFAULT;
