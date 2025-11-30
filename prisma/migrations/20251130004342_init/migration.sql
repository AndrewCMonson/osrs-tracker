-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Player" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "displayName" TEXT,
    "accountType" TEXT NOT NULL DEFAULT 'normal',
    "totalLevel" INTEGER NOT NULL,
    "totalXp" BIGINT NOT NULL,
    "combatLevel" INTEGER NOT NULL DEFAULT 3,
    "claimedById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Player_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Skill" (
    "id" TEXT NOT NULL,
    "playerId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "level" INTEGER NOT NULL,
    "xp" BIGINT NOT NULL,
    "rank" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Skill_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BossKC" (
    "id" TEXT NOT NULL,
    "playerId" TEXT NOT NULL,
    "bossName" TEXT NOT NULL,
    "kc" INTEGER NOT NULL,
    "rank" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "BossKC_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlayerSnapshot" (
    "id" TEXT NOT NULL,
    "playerId" TEXT NOT NULL,
    "totalLevel" INTEGER NOT NULL,
    "totalXp" BIGINT NOT NULL,
    "combatLevel" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PlayerSnapshot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SkillSnapshot" (
    "id" TEXT NOT NULL,
    "snapshotId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "level" INTEGER NOT NULL,
    "xp" BIGINT NOT NULL,
    "rank" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "SkillSnapshot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BossSnapshot" (
    "id" TEXT NOT NULL,
    "snapshotId" TEXT NOT NULL,
    "bossName" TEXT NOT NULL,
    "kc" INTEGER NOT NULL,
    "rank" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "BossSnapshot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Milestone" (
    "id" TEXT NOT NULL,
    "playerId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "details" TEXT NOT NULL,
    "achieved" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Milestone_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Player_username_key" ON "Player"("username");

-- CreateIndex
CREATE INDEX "Player_username_idx" ON "Player"("username");

-- CreateIndex
CREATE INDEX "Skill_playerId_idx" ON "Skill"("playerId");

-- CreateIndex
CREATE UNIQUE INDEX "Skill_playerId_name_key" ON "Skill"("playerId", "name");

-- CreateIndex
CREATE INDEX "BossKC_playerId_idx" ON "BossKC"("playerId");

-- CreateIndex
CREATE UNIQUE INDEX "BossKC_playerId_bossName_key" ON "BossKC"("playerId", "bossName");

-- CreateIndex
CREATE INDEX "PlayerSnapshot_playerId_createdAt_idx" ON "PlayerSnapshot"("playerId", "createdAt");

-- CreateIndex
CREATE INDEX "PlayerSnapshot_playerId_idx" ON "PlayerSnapshot"("playerId");

-- CreateIndex
CREATE INDEX "SkillSnapshot_snapshotId_idx" ON "SkillSnapshot"("snapshotId");

-- CreateIndex
CREATE INDEX "BossSnapshot_snapshotId_idx" ON "BossSnapshot"("snapshotId");

-- CreateIndex
CREATE INDEX "Milestone_playerId_idx" ON "Milestone"("playerId");

-- AddForeignKey
ALTER TABLE "Player" ADD CONSTRAINT "Player_claimedById_fkey" FOREIGN KEY ("claimedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Skill" ADD CONSTRAINT "Skill_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BossKC" ADD CONSTRAINT "BossKC_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlayerSnapshot" ADD CONSTRAINT "PlayerSnapshot_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SkillSnapshot" ADD CONSTRAINT "SkillSnapshot_snapshotId_fkey" FOREIGN KEY ("snapshotId") REFERENCES "PlayerSnapshot"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BossSnapshot" ADD CONSTRAINT "BossSnapshot_snapshotId_fkey" FOREIGN KEY ("snapshotId") REFERENCES "PlayerSnapshot"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Milestone" ADD CONSTRAINT "Milestone_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player"("id") ON DELETE CASCADE ON UPDATE CASCADE;
