-- AlterTable
ALTER TABLE `orders` ADD COLUMN `status` ENUM('PENDING', 'ACCEPTED', 'OUT_FORDELIVERY', 'DELIVERED', 'CANCELLED') NOT NULL DEFAULT 'PENDING';
