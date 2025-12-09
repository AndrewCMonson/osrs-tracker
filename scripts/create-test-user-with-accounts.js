/**
 * Script to create a test user with fake claimed accounts
 * 
 * Run with: node scripts/create-test-user-with-accounts.js
 */

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

// Fake account data
const fakeAccounts = [
  {
    username: 'testmain',
    displayName: 'TestMain',
    accountType: 'normal',
    totalLevel: 1500,
    totalXp: 50_000_000,
    combatLevel: 100,
    skills: [
      { name: 'attack', level: 80, xp: 3_000_000, rank: 100000 },
      { name: 'strength', level: 85, xp: 4_000_000, rank: 95000 },
      { name: 'defence', level: 75, xp: 2_500_000, rank: 110000 },
      { name: 'hitpoints', level: 90, xp: 5_000_000, rank: 80000 },
      { name: 'ranged', level: 82, xp: 3_200_000, rank: 98000 },
      { name: 'prayer', level: 70, xp: 1_500_000, rank: 120000 },
      { name: 'magic', level: 88, xp: 4_500_000, rank: 85000 },
      { name: 'cooking', level: 99, xp: 13_000_000, rank: 50000 },
      { name: 'woodcutting', level: 95, xp: 10_000_000, rank: 60000 },
      { name: 'fletching', level: 85, xp: 4_000_000, rank: 95000 },
      { name: 'fishing', level: 92, xp: 8_000_000, rank: 70000 },
      { name: 'firemaking', level: 80, xp: 3_000_000, rank: 100000 },
      { name: 'crafting', level: 75, xp: 2_500_000, rank: 110000 },
      { name: 'smithing', level: 70, xp: 1_500_000, rank: 120000 },
      { name: 'mining', level: 85, xp: 4_000_000, rank: 95000 },
      { name: 'herblore', level: 78, xp: 2_800_000, rank: 105000 },
      { name: 'agility', level: 80, xp: 3_000_000, rank: 100000 },
      { name: 'thieving', level: 75, xp: 2_500_000, rank: 110000 },
      { name: 'slayer', level: 90, xp: 5_000_000, rank: 80000 },
      { name: 'farming', level: 82, xp: 3_200_000, rank: 98000 },
      { name: 'runecraft', level: 65, xp: 1_000_000, rank: 130000 },
      { name: 'hunter', level: 80, xp: 3_000_000, rank: 100000 },
      { name: 'construction', level: 70, xp: 1_500_000, rank: 120000 },
      { name: 'sailing', level: 50, xp: 500_000, rank: 150000 },
    ],
  },
  {
    username: 'testiron',
    displayName: 'TestIron',
    accountType: 'ironman',
    totalLevel: 1200,
    totalXp: 30_000_000,
    combatLevel: 85,
    skills: [
      { name: 'attack', level: 70, xp: 1_500_000, rank: 200000 },
      { name: 'strength', level: 72, xp: 1_800_000, rank: 190000 },
      { name: 'defence', level: 68, xp: 1_200_000, rank: 210000 },
      { name: 'hitpoints', level: 75, xp: 2_500_000, rank: 180000 },
      { name: 'ranged', level: 70, xp: 1_500_000, rank: 200000 },
      { name: 'prayer', level: 60, xp: 800_000, rank: 220000 },
      { name: 'magic', level: 75, xp: 2_500_000, rank: 180000 },
      { name: 'cooking', level: 85, xp: 4_000_000, rank: 160000 },
      { name: 'woodcutting', level: 80, xp: 3_000_000, rank: 170000 },
      { name: 'fletching', level: 75, xp: 2_500_000, rank: 180000 },
      { name: 'fishing', level: 82, xp: 3_200_000, rank: 175000 },
      { name: 'firemaking', level: 70, xp: 1_500_000, rank: 200000 },
      { name: 'crafting', level: 68, xp: 1_200_000, rank: 210000 },
      { name: 'smithing', level: 65, xp: 1_000_000, rank: 215000 },
      { name: 'mining', level: 80, xp: 3_000_000, rank: 170000 },
      { name: 'herblore', level: 70, xp: 1_500_000, rank: 200000 },
      { name: 'agility', level: 75, xp: 2_500_000, rank: 180000 },
      { name: 'thieving', level: 72, xp: 1_800_000, rank: 190000 },
      { name: 'slayer', level: 78, xp: 2_800_000, rank: 185000 },
      { name: 'farming', level: 75, xp: 2_500_000, rank: 180000 },
      { name: 'runecraft', level: 60, xp: 800_000, rank: 220000 },
      { name: 'hunter', level: 70, xp: 1_500_000, rank: 200000 },
      { name: 'construction', level: 65, xp: 1_000_000, rank: 215000 },
      { name: 'sailing', level: 40, xp: 200_000, rank: 250000 },
    ],
  },
  {
    username: 'testpure',
    displayName: 'TestPure',
    accountType: 'normal',
    totalLevel: 800,
    totalXp: 15_000_000,
    combatLevel: 65,
    skills: [
      { name: 'attack', level: 60, xp: 500_000, rank: 300000 },
      { name: 'strength', level: 99, xp: 13_000_000, rank: 40000 },
      { name: 'defence', level: 1, xp: 0, rank: 500000 },
      { name: 'hitpoints', level: 75, xp: 2_500_000, rank: 250000 },
      { name: 'ranged', level: 99, xp: 13_000_000, rank: 40000 },
      { name: 'prayer', level: 52, xp: 300_000, rank: 350000 },
      { name: 'magic', level: 94, xp: 11_000_000, rank: 50000 },
      { name: 'cooking', level: 50, xp: 200_000, rank: 400000 },
      { name: 'woodcutting', level: 50, xp: 200_000, rank: 400000 },
      { name: 'fletching', level: 50, xp: 200_000, rank: 400000 },
      { name: 'fishing', level: 50, xp: 200_000, rank: 400000 },
      { name: 'firemaking', level: 50, xp: 200_000, rank: 400000 },
      { name: 'crafting', level: 50, xp: 200_000, rank: 400000 },
      { name: 'smithing', level: 50, xp: 200_000, rank: 400000 },
      { name: 'mining', level: 50, xp: 200_000, rank: 400000 },
      { name: 'herblore', level: 50, xp: 200_000, rank: 400000 },
      { name: 'agility', level: 50, xp: 200_000, rank: 400000 },
      { name: 'thieving', level: 50, xp: 200_000, rank: 400000 },
      { name: 'slayer', level: 50, xp: 200_000, rank: 400000 },
      { name: 'farming', level: 50, xp: 200_000, rank: 400000 },
      { name: 'runecraft', level: 50, xp: 200_000, rank: 400000 },
      { name: 'hunter', level: 50, xp: 200_000, rank: 400000 },
      { name: 'construction', level: 50, xp: 200_000, rank: 400000 },
      { name: 'sailing', level: 1, xp: 0, rank: 500000 },
    ],
  },
];

async function createTestUserWithAccounts() {
  const email = 'test@test.com';
  const password = 'test123';
  const name = 'Test User';

  try {
    // Check if user already exists
    let user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      // Hash password
      const passwordHash = await bcrypt.hash(password, 12);

      // Create user
      user = await prisma.user.create({
        data: {
          email,
          name,
          password: passwordHash,
        },
      });

      console.log('✅ Test user created successfully!');
    } else {
      console.log('ℹ️  Test user already exists, using existing user');
    }

    // Create or update fake accounts
    for (const accountData of fakeAccounts) {
      // Check if player exists
      let player = await prisma.player.findUnique({
        where: { username: accountData.username.toLowerCase() },
        include: { skills: true },
      });

      if (player) {
        // Update existing player
        player = await prisma.player.update({
          where: { id: player.id },
          data: {
            displayName: accountData.displayName,
            accountType: accountData.accountType,
            totalLevel: accountData.totalLevel,
            totalXp: BigInt(accountData.totalXp),
            combatLevel: accountData.combatLevel,
            claimedById: user.id,
          },
        });

        // Delete existing skills
        await prisma.skill.deleteMany({
          where: { playerId: player.id },
        });

        console.log(`✅ Updated player: ${accountData.username}`);
      } else {
        // Create new player
        player = await prisma.player.create({
          data: {
            username: accountData.username.toLowerCase(),
            displayName: accountData.displayName,
            accountType: accountData.accountType,
            totalLevel: accountData.totalLevel,
            totalXp: BigInt(accountData.totalXp),
            combatLevel: accountData.combatLevel,
            claimedById: user.id,
          },
        });

        console.log(`✅ Created player: ${accountData.username}`);
      }

      // Create skills
      for (const skillData of accountData.skills) {
        await prisma.skill.upsert({
          where: {
            playerId_name: {
              playerId: player.id,
              name: skillData.name,
            },
          },
          create: {
            playerId: player.id,
            name: skillData.name,
            level: skillData.level,
            xp: BigInt(skillData.xp),
            rank: skillData.rank,
          },
          update: {
            level: skillData.level,
            xp: BigInt(skillData.xp),
            rank: skillData.rank,
          },
        });
      }

      console.log(`  ✅ Created/updated ${accountData.skills.length} skills`);
    }

    console.log('\n📧 Login Credentials:');
    console.log('  Email:', email);
    console.log('  Password:', password);
    console.log('\n🎮 Created Accounts:');
    fakeAccounts.forEach(acc => {
      console.log(`  - ${acc.displayName} (${acc.accountType}) - ${acc.totalLevel} total level`);
    });
    console.log('\n🔗 Dashboard: http://localhost:3000/dashboard');
    console.log('🔗 Login: http://localhost:3000/login');
  } catch (error) {
    console.error('❌ Error creating test user with accounts:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

createTestUserWithAccounts();





