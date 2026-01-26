-- CreateEnum
CREATE TYPE "SLAStatus" AS ENUM ('ACTIVE', 'PAUSED', 'BREACHED', 'COMPLETED');

-- CreateTable
CREATE TABLE "SLA" (
    "id" TEXT NOT NULL,
    "ticketId" TEXT NOT NULL,
    "status" "SLAStatus" NOT NULL,
    "startedAt" TIMESTAMP(3) NOT NULL,
    "pausedAt" TIMESTAMP(3),
    "totalPaused" INTEGER NOT NULL DEFAULT 0,
    "duration" INTEGER NOT NULL,
    "breachedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),

    CONSTRAINT "SLA_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SLA_ticketId_key" ON "SLA"("ticketId");

-- CreateIndex
CREATE INDEX "SLA_status_idx" ON "SLA"("status");

-- AddForeignKey
ALTER TABLE "SLA" ADD CONSTRAINT "SLA_ticketId_fkey" FOREIGN KEY ("ticketId") REFERENCES "Ticket"("id") ON DELETE CASCADE ON UPDATE CASCADE;
