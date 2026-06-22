/*
  Warnings:

  - You are about to drop the column `target` on the `RegistryInstance` table. All the data in the column will be lost.
  - Added the required column `event` to the `RegistryInstance` table without a default value. This is not possible if the table is not empty.
  - Added the required column `path` to the `RegistryInstance` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "RegistryInstance" DROP COLUMN "target",
ADD COLUMN     "event" TEXT NOT NULL,
ADD COLUMN     "path" TEXT NOT NULL;
