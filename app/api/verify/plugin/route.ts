import { NextRequest, NextResponse } from 'next/server';
import { normalizeUsername } from '@/lib/utils';
import { prisma } from '@/lib/db';

/**
 * Endpoint for RuneLite plugin to call for verification
 * 
 * The plugin workflow:
 * 1. User installs plugin and connects to our service
 * 2. User clicks "Claim Account" on our website
 * 3. Website displays a verification code
 * 4. Plugin detects the logged-in character and sends:
 *    - Character name (normalized)
 *    - Verification token (entered by user)
 *    - Plugin version (for compatibility tracking)
 *    - Timestamp (for replay attack prevention)
 * 5. We verify the request and link the account
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      username,      // The OSRS character name (will be normalized)
      token,         // The verification token from our website
      pluginVersion, // Plugin version for compatibility
      timestamp,     // Request timestamp
      signature,     // HMAC signature for request validation (future use)
    } = body;

    // Validate required fields
    if (!username || !token) {
      return NextResponse.json(
        { success: false, error: 'Username and token are required' },
        { status: 400 }
      );
    }

    // Normalize username (plugin should do this, but we'll do it server-side too)
    const normalizedUsername = normalizeUsername(username);

    // Look up the verification token
    const verification = await prisma.claimVerification.findFirst({
      where: {
        token,
        username: normalizedUsername,
        status: 'pending',
      },
      orderBy: { createdAt: 'desc' },
    });

    if (!verification) {
      return NextResponse.json(
        { success: false, error: 'Invalid or expired verification token' },
        { status: 400 }
      );
    }

    // Check if token has expired
    if (verification.expiresAt < new Date()) {
      await prisma.claimVerification.update({
        where: { id: verification.id },
        data: { status: 'expired' },
      });
      return NextResponse.json(
        { success: false, error: 'Verification token has expired. Please start a new verification.' },
        { status: 400 }
      );
    }

    // Check if username matches
    if (verification.username !== normalizedUsername) {
      return NextResponse.json(
        { success: false, error: 'Username does not match verification token' },
        { status: 400 }
      );
    }

    // Check if account is already claimed
    const player = await prisma.player.findUnique({
      where: { username: normalizedUsername },
      select: { claimedById: true, id: true },
    });

    if (!player) {
      return NextResponse.json(
        { success: false, error: 'Player not found. Please ensure the account exists in our database.' },
        { status: 404 }
      );
    }

    if (player.claimedById) {
      // Mark verification as failed since account is already claimed
      await prisma.claimVerification.update({
        where: { id: verification.id },
        data: { status: 'failed' },
      });
      return NextResponse.json(
        { success: false, error: 'This account is already claimed by another user' },
        { status: 400 }
      );
    }

    // Complete the verification
    // 1. Mark verification as verified
    await prisma.claimVerification.update({
      where: { id: verification.id },
      data: { 
        status: 'verified',
        verifiedAt: new Date(),
      },
    });

    // 2. Link the account to the user
    await prisma.player.update({
      where: { id: player.id },
      data: { 
        claimedById: verification.userId,
      },
    });

    console.log(`Account verified: ${normalizedUsername} claimed by user ${verification.userId}`);

    return NextResponse.json({
      success: true,
      message: 'Account verified successfully!',
      verified: true,
    });
  } catch (error) {
    console.error('Error processing plugin verification:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to process verification' },
      { status: 500 }
    );
  }
}

/**
 * GET endpoint for plugin to check connection status
 */
export async function GET() {
  return NextResponse.json({
    success: true,
    service: 'OSRS Tracker Verification API',
    version: '1.0.0',
    status: 'operational',
  });
}





