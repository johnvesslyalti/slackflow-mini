/*
  Warnings:

  - You are about to drop the column `channelId` on the `Request` table. All the data in the column will be lost.
  - You are about to drop the column `createdBy` on the `Request` table. All the data in the column will be lost.
  - You are about to drop the column `externalTicketId` on the `Request` table. All the data in the column will be lost.
  - You are about to drop the column `owner` on the `Request` table. All the data in the column will be lost.
  - You are about to drop the column `resolvedAt` on the `Request` table. All the data in the column will be lost.
  - You are about to drop the column `slackMessageId` on the `Request` table. All the data in the column will be lost.
  - The `status` column on the `Request` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `customerId` to the `Request` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `Request` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Request` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "RequestStatus" AS ENUM ('OPEN', 'ACCEPTED', 'CLOSED');

-- CreateEnum
CREATE TYPE "TicketStatus" AS ENUM ('ACTIVE', 'WAITING_ON_CUSTOMER', 'RESOLVED');

-- AlterTable
ALTER TABLE "Request" DROP COLUMN "channelId",
DROP COLUMN "createdBy",
DROP COLUMN "externalTicketId",
DROP COLUMN "owner",
DROP COLUMN "resolvedAt",
DROP COLUMN "slackMessageId",
ADD COLUMN     "agentId" TEXT,
ADD COLUMN     "customerId" TEXT NOT NULL,
ADD COLUMN     "description" TEXT,
ADD COLUMN     "title" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
DROP COLUMN "status",
ADD COLUMN     "status" "RequestStatus" NOT NULL DEFAULT 'OPEN';

-- CreateTable
CREATE TABLE "Ticket" (
    "id" TEXT NOT NULL,
    "requestId" TEXT NOT NULL,
    "agentId" TEXT NOT NULL,
    "status" "TicketStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Ticket_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Ticket_requestId_key" ON "Ticket"("requestId");

-- CreateIndex
CREATE INDEX "Ticket_agentId_idx" ON "Ticket"("agentId");

-- CreateIndex
CREATE INDEX "Ticket_status_idx" ON "Ticket"("status");

-- CreateIndex
CREATE INDEX "Request_status_idx" ON "Request"("status");

-- CreateIndex
CREATE INDEX "Request_customerId_idx" ON "Request"("customerId");

-- AddForeignKey
ALTER TABLE "Ticket" ADD CONSTRAINT "Ticket_requestId_fkey" FOREIGN KEY ("requestId") REFERENCES "Request"("id") ON DELETE CASCADE ON UPDATE CASCADE;
