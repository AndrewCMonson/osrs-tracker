import { NextRequest, NextResponse } from 'next/server';
import { generateToken } from '@/lib/utils';

/**
 * Start the account verification process
 * 
 * In a real implementation:
 * 1. Require authentication
 * 2. Check if the account is already claimed
 * 3. Generate a unique verification token
 * 4. Store the token in the database with expiration
 * 5. Return instructions for the RuneLite plugin
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username } = body;

    if (!username) {
      return NextResponse.json(
        { success: false, error: 'Username is required' },
        { status: 400 }
      );
    }

    // Generate a verification token
    const token = generateToken(8); // Short token for easy entry in-game
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    // In production, save this to the database
    // await prisma.claimVerification.create({...})

    return NextResponse.json({
      success: true,
      verification: {
        id: `verify_${Date.now()}`,
        token,
        expiresAt,
        instructions: `To verify ownership of "${username}", please do one of the following within 15 minutes:\n\n` +
          `1. Using RuneLite Plugin:\n` +
          `   - Install the "OSRS Tracker" plugin from the Plugin Hub\n` +
          `   - Click "Verify Account" in the plugin panel\n` +
          `   - The plugin will automatically complete verification\n\n` +
          `2. Manual Verification:\n` +
          `   - Log into the game on your "${username}" account\n` +
          `   - Set your private chat status to "Friends"\n` +
          `   - Wait for our system to detect the change\n\n` +
          `Verification Token: ${token}`,
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


