-- CreateTable
CREATE TABLE "Request" (
    "id" TEXT NOT NULL,
    "slackMessageId" TEXT,
    "channelId" TEXT,
    "createdBy" TEXT,
    "status" TEXT NOT NULL,
    "owner" TEXT,
    "externalTicketId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "resolvedAt" TIMESTAMP(3),

    CONSTRAINT "Request_pkey" PRIMARY KEY ("id")
);
