-- AlterTable
ALTER TABLE "User" ADD COLUMN     "name" TEXT;

-- CreateTable
CREATE TABLE "ClaimVerification" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "verifiedAt" TIMESTAMP(3),

    CONSTRAINT "ClaimVerification_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ClaimVerification_token_key" ON "ClaimVerification"("token");

-- CreateIndex
CREATE INDEX "ClaimVerification_username_idx" ON "ClaimVerification"("username");

-- CreateIndex
CREATE INDEX "ClaimVerification_token_idx" ON "ClaimVerification"("token");

-- CreateIndex
CREATE INDEX "ClaimVerification_userId_idx" ON "ClaimVerification"("userId");

-- CreateIndex
CREATE INDEX "ClaimVerification_status_idx" ON "ClaimVerification"("status");

-- AddForeignKey
ALTER TABLE "ClaimVerification" ADD CONSTRAINT "ClaimVerification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
