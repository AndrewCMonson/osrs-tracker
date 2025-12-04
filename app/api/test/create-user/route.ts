/**
 * One-time endpoint to create a test admin user
 * 
 * This endpoint should be disabled in production!
 * Call once: POST /api/test/create-user
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { hashPassword } from '@/lib/auth';

export async function POST(request: NextRequest) {
  // Only allow in development
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json(
      { success: false, error: 'This endpoint is disabled in production' },
      { status: 403 }
    );
  }

  const email = 'admin@test.com';
  const password = 'Admin123!';
  const name = 'Test Admin';

  try {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json({
        success: true,
        message: 'User already exists',
        credentials: {
          email,
          password,
        },
      });
    }

    // Hash password
    const passwordHash = await hashPassword(password);

    // Create user
    try {
      const user = await prisma.user.create({
        data: {
          email,
          name,
          password: passwordHash,
        },
        select: {
          id: true,
          name: true,
          email: true,
          createdAt: true,
        },
      });

      return NextResponse.json({
        success: true,
        message: 'Test user created successfully!',
        user,
        credentials: {
          email,
          password,
        },
        warning: '⚠️ Please change the password after first login!',
      });
    } catch (createError: any) {
    }
  } catch (error: any) {
    console.error('Error creating test user:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create test user',
        details: error.message,
        hint: 'Make sure your database is set up and Prisma schema matches your code',
      },
      { status: 500 }
    );
  }
}

