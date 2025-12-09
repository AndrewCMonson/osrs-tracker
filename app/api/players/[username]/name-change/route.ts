import { NextRequest } from 'next/server';
import { submitNameChange, validateNameChange } from '@/services/name-change';
import { successResponse, errorResponse } from '@/lib/api/response';

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
      return errorResponse('New username is required', 400);
    }

    // Submit the name change (this will validate the full name change)
    const result = await submitNameChange(decodedUsername, newUsername);

    if (!result.success) {
      return errorResponse(result.error || 'Failed to submit name change', 400);
    }

    return successResponse({
      message: 'Name change submitted successfully',
      playerId: result.playerId,
    });
  } catch (error) {
    console.error('Error submitting name change:', error);
    return errorResponse('Failed to submit name change', 500, error);
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
      return errorResponse('newUsername query parameter is required', 400);
    }

    // Validate the full name change (checks old username, new username, and stats match)
    const validation = await validateNameChange(decodedUsername, newUsername);

    return successResponse({
      valid: validation.valid,
      verified: validation.verified,
      error: validation.error,
    });
  } catch (error) {
    console.error('Error validating name change:', error);
    return errorResponse('Failed to validate name change', 500, error);
  }
}


