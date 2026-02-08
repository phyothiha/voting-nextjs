-- CreateTable
CREATE TABLE "GiftExchange" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "targetUserId" INTEGER,
    "status" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "GiftExchange_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "GiftExchange_targetUserId_fkey" FOREIGN KEY ("targetUserId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "GiftExchange_userId_key" ON "GiftExchange"("userId");

-- CreateIndex
CREATE INDEX "GiftExchange_status_idx" ON "GiftExchange"("status");

-- CreateIndex
CREATE INDEX "GiftExchange_targetUserId_idx" ON "GiftExchange"("targetUserId");
