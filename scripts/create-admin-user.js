/**
 * Script to create a test admin/user account (CommonJS version)
 * 
 * Run with: node scripts/create-admin-user.js
 */

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function createAdminUser() {
  const email = 'admin@test.com';
  const password = 'Admin123!';
  const name = 'Test Admin';

  try {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      console.log('❌ User already exists with email:', email);
      console.log('\n📧 You can use these credentials:');
      console.log('  Email:', email);
      console.log('  Password:', password);
      console.log('\n🔗 Login at: http://localhost:3000/login');
      await prisma.$disconnect();
      return;
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 12);

    // Try creating with passwordHash field first (matches register route)
    try {
      const user = await prisma.user.create({
        data: {
          email,
          name,
          passwordHash,
        },
      });

      console.log('✅ Admin user created successfully!');
      console.log('\n📧 Login Credentials:');
      console.log('  Email:', email);
      console.log('  Password:', password);
      console.log('\n⚠️  Please change the password after first login!');
      console.log('\n🔗 Login at: http://localhost:3000/login');
    } catch (createError) {
      // If that fails, try with 'password' field
      if (createError.message && createError.message.includes('passwordHash')) {
        console.log('⚠️  Trying with "password" field name...');
        const user = await prisma.user.create({
          data: {
            email,
            name,
            password: passwordHash,
          },
        });
        console.log('✅ Admin user created successfully (using "password" field)!');
        console.log('\n📧 Login Credentials:');
        console.log('  Email:', email);
        console.log('  Password:', password);
        console.log('\n⚠️  Please change the password after first login!');
        console.log('\n🔗 Login at: http://localhost:3000/login');
      } else {
        throw createError;
      }
    }
  } catch (error) {
    console.error('❌ Error creating admin user:', error);
    console.log('\n💡 Make sure:');
    console.log('  1. DATABASE_URL is set in your .env file');
    console.log('  2. Prisma migrations have been run (npx prisma migrate dev)');
    console.log('  3. Prisma client is generated (npx prisma generate)');
  } finally {
    await prisma.$disconnect();
  }
}

createAdminUser();





