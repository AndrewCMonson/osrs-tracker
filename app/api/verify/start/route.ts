import { NextRequest, NextResponse } from 'next/server';
import { generateToken, normalizeUsername } from '@/lib/utils';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';

/**
 * Start the account verification process
 * 
 * 1. Require authentication
 * 2. Check if the account is already claimed
 * 3. Generate a unique verification token
 * 4. Store the token in the database with expiration
 * 5. Return instructions for the RuneLite plugin
 */
export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { username } = body;

    if (!username) {
      return NextResponse.json(
        { success: false, error: 'Username is required' },
        { status: 400 }
      );
    }

    const normalizedUsername = normalizeUsername(username);

    // Check if account is already claimed
    const player = await prisma.player.findUnique({
      where: { username: normalizedUsername },
      select: { claimedById: true },
    });

    if (player?.claimedById) {
      return NextResponse.json(
        { success: false, error: 'This account is already claimed by another user' },
        { status: 400 }
      );
    }

    // Check if user already has a pending verification for this username
    const existingVerification = await prisma.claimVerification.findFirst({
      where: {
        userId: session.user.id,
        username: normalizedUsername,
        status: 'pending',
        expiresAt: { gt: new Date() },
      },
      orderBy: { createdAt: 'desc' },
    });

    let verification;
    if (existingVerification) {
      // Return existing verification
      verification = existingVerification;
    } else {
      // Generate a new verification token
      const token = generateToken(8); // Short token for easy entry in-game
      const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

      // Save to database
      verification = await prisma.claimVerification.create({
        data: {
          userId: session.user.id,
          username: normalizedUsername,
          token,
          expiresAt,
          status: 'pending',
        },
      });
    }

    return NextResponse.json({
      success: true,
      verification: {
        id: verification.id,
        token: verification.token,
        expiresAt: verification.expiresAt,
        instructions: `To verify ownership of "${username}", please do the following within 15 minutes:\n\n` +
          `1. Using RuneLite Plugin:\n` +
          `   - Install the "OSRS Tracker" plugin from the Plugin Hub\n` +
          `   - Log into the game on your "${username}" account\n` +
          `   - Open the plugin panel and enter the verification token below\n` +
          `   - Click "Verify Account" to complete verification\n\n` +
          `Verification Token: ${verification.token}`,
      },
    });
  } catch (error) {
    console.error('Error starting verification:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to start verification' },
      { status: 500 }
    );
  }
}





