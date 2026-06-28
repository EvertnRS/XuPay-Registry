/*
  Warnings:

  - Added the required column `ip` to the `RegistryInstance` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lastHeartBeat` to the `RegistryInstance` table without a default value. This is not possible if the table is not empty.
  - Added the required column `port` to the `RegistryInstance` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "RegistryInstance" ADD COLUMN     "ip" TEXT NOT NULL,
ADD COLUMN     "lastHeartBeat" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "port" TEXT NOT NULL;
