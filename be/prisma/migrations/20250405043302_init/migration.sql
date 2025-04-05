/*
  Warnings:

  - You are about to drop the column `address` on the `order` table. All the data in the column will be lost.
  - You are about to drop the column `amount` on the `order` table. All the data in the column will be lost.
  - You are about to drop the column `captureId` on the `order` table. All the data in the column will be lost.
  - You are about to drop the column `method` on the `order` table. All the data in the column will be lost.
  - You are about to drop the column `payer` on the `order` table. All the data in the column will be lost.
  - You are about to drop the column `rawResponse` on the `order` table. All the data in the column will be lost.
  - You are about to drop the column `transactionId` on the `order` table. All the data in the column will be lost.
  - Added the required column `totalAmount` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `order` DROP COLUMN `address`,
    DROP COLUMN `amount`,
    DROP COLUMN `captureId`,
    DROP COLUMN `method`,
    DROP COLUMN `payer`,
    DROP COLUMN `rawResponse`,
    DROP COLUMN `transactionId`,
    ADD COLUMN `totalAmount` DECIMAL(10, 2) NOT NULL;
