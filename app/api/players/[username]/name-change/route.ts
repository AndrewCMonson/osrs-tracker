import { NextRequest, NextResponse } from 'next/server';
import { submitNameChange, validateNameChange, validateNewUsername } from '@/services/name-change';
import { normalizeUsername } from '@/lib/utils';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  try {
    const { username } = await params;
    const decodedUsername = decodeURIComponent(username);
    const body = await request.json();
    const { newUsername } = body;

    if (!newUsername || typeof newUsername !== 'string') {
      return NextResponse.json(
        { success: false, error: 'New username is required' },
        { status: 400 }
      );
    }

    // Submit the name change (this will validate the full name change)
    const result = await submitNameChange(decodedUsername, newUsername);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Name change submitted successfully',
      playerId: result.playerId,
    });
  } catch (error) {
    console.error('Error submitting name change:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to submit name change' },
      { status: 500 }
    );
  }
}

/**
 * Validate a name change before submission
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  try {
    const { username } = await params;
    const decodedUsername = decodeURIComponent(username);
    const { searchParams } = new URL(request.url);
    const newUsername = searchParams.get('newUsername');

    if (!newUsername) {
      return NextResponse.json(
        { success: false, error: 'newUsername query parameter is required' },
        { status: 400 }
      );
    }

    // Validate the full name change (checks old username, new username, and stats match)
    const validation = await validateNameChange(decodedUsername, newUsername);

    return NextResponse.json({
      success: validation.valid,
      valid: validation.valid,
      verified: validation.verified,
      error: validation.error,
    });
  } catch (error) {
    console.error('Error validating name change:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to validate name change' },
      { status: 500 }
    );
  }
}


