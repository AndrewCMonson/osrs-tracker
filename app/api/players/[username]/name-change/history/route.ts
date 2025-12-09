import { NextRequest, NextResponse } from 'next/server';
import { getNameChangeHistory, getPlayerIdByUsername } from '@/services/name-change';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  try {
    const { username } = await params;
    const decodedUsername = decodeURIComponent(username);

    // Find the player ID
    const playerId = await getPlayerIdByUsername(decodedUsername);

    if (!playerId) {
      return NextResponse.json(
        { success: false, error: 'Player not found' },
        { status: 404 }
      );
    }

    // Get name change history
    const nameChanges = await getNameChangeHistory(playerId);

    return NextResponse.json({
      success: true,
      nameChanges: nameChanges.map((change: typeof nameChanges[number]) => ({
        id: change.id,
        oldUsername: change.oldUsername,
        newUsername: change.newUsername,
        createdAt: change.createdAt.toISOString(),
      })),
    });
  } catch (error) {
    console.error('Error fetching name change history:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch name change history' },
      { status: 500 }
    );
  }
}



