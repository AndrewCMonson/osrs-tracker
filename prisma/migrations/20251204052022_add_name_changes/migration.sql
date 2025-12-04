/*
  Warnings:

  - A unique constraint covering the columns `[snapshotId,bossName]` on the table `BossSnapshot` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[snapshotId,name]` on the table `SkillSnapshot` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateTable
CREATE TABLE "PlayerNameChange" (
    "id" TEXT NOT NULL,
    "playerId" TEXT NOT NULL,
    "oldUsername" TEXT NOT NULL,
    "newUsername" TEXT NOT NULL,
    "validated" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PlayerNameChange_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "PlayerNameChange_playerId_idx" ON "PlayerNameChange"("playerId");

-- CreateIndex
CREATE INDEX "PlayerNameChange_oldUsername_idx" ON "PlayerNameChange"("oldUsername");

-- CreateIndex
CREATE INDEX "PlayerNameChange_newUsername_idx" ON "PlayerNameChange"("newUsername");

-- CreateIndex
CREATE UNIQUE INDEX "PlayerNameChange_oldUsername_newUsername_key" ON "PlayerNameChange"("oldUsername", "newUsername");

-- CreateIndex
CREATE UNIQUE INDEX "BossSnapshot_snapshotId_bossName_key" ON "BossSnapshot"("snapshotId", "bossName");

-- CreateIndex
CREATE UNIQUE INDEX "SkillSnapshot_snapshotId_name_key" ON "SkillSnapshot"("snapshotId", "name");

-- AddForeignKey
ALTER TABLE "PlayerNameChange" ADD CONSTRAINT "PlayerNameChange_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player"("id") ON DELETE CASCADE ON UPDATE CASCADE;
