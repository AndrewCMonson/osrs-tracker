import { NextRequest } from 'next/server';
import { lookupPlayer } from '@/services/player';
import { savePlayerSnapshot } from '@/services/snapshot';
import { successResponse, errorResponse, notFoundResponse } from '@/lib/api/response';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  try {
    const { username } = await params;
    const decodedUsername = decodeURIComponent(username);
    
    // Force refresh from OSRS hiscores
    const result = await lookupPlayer(decodedUsername);

    if (!result.success || !result.player) {
      return notFoundResponse(result.error || 'Player not found');
    }

    // Update the database with new stats and create a snapshot
    await savePlayerSnapshot(result.player, true); // Force snapshot creation

    return successResponse({
      player: result.player,
      message: 'Player data refreshed successfully',
    });
  } catch (error) {
    console.error('Error refreshing player:', error);
    return errorResponse('Failed to refresh player data', 500, error);
  }
}









