/**
 * Script to create a test admin/user account
 * 
 * Run with: npx tsx scripts/create-admin-user.ts
 * Or: npx ts-node scripts/create-admin-user.ts
 */

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

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
      console.log('You can use these credentials:');
      console.log('  Email:', email);
      console.log('  Password:', password);
      return;
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 12);

    // Create user
    // Note: Using passwordHash to match the register route pattern
    // If your schema uses 'password', change this accordingly
    const user = await prisma.user.create({
      data: {
        email,
        name,
        passwordHash, // Change to 'password' if schema field is different
      },
    });

    console.log('✅ Admin user created successfully!');
    console.log('\n📧 Login Credentials:');
    console.log('  Email:', email);
    console.log('  Password:', password);
    console.log('\n⚠️  Please change the password after first login!');
    console.log('\n🔗 Login at: http://localhost:3000/login');
  } catch (error) {
    console.error('❌ Error creating admin user:', error);
    
    // Try alternative schema field name
    if (error instanceof Error && error.message.includes('passwordHash')) {
      console.log('\n⚠️  Attempting with field name "password"...');
      try {
        const passwordHash = await bcrypt.hash(password, 12);
        const user = await prisma.user.create({
          data: {
            email,
            name,
            password: passwordHash, // Try 'password' field
          },
        });
        console.log('✅ Admin user created with "password" field!');
        console.log('\n📧 Login Credentials:');
        console.log('  Email:', email);
        console.log('  Password:', password);
      } catch (retryError) {
        console.error('❌ Failed with both field names. Please check your Prisma schema.');
      }
    }
  } finally {
    await prisma.$disconnect();
  }
}

createAdminUser();

