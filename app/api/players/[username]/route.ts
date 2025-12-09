import { NextRequest } from 'next/server';
import { lookupPlayer } from '@/services/player';
import { successResponse, errorResponse, notFoundResponse } from '@/lib/api/response';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  try {
    const { username } = await params;
    const decodedUsername = decodeURIComponent(username);
    
    const result = await lookupPlayer(decodedUsername);

    if (!result.success) {
      return notFoundResponse(result.error || 'Player not found');
    }

    return successResponse({
      player: result.player,
    });
  } catch (error) {
    console.error('Error fetching player:', error);
    return errorResponse('Failed to fetch player data', 500, error);
  }
}









