import { NextRequest, NextResponse } from 'next/server';
import { lookupPlayer } from '@/services/player';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  try {
    const { username } = await params;
    const decodedUsername = decodeURIComponent(username);
    
    // Force refresh from OSRS hiscores
    const result = await lookupPlayer(decodedUsername);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 404 }
      );
    }

    // In a real implementation, you would:
    // 1. Update the database with new stats
    // 2. Create a snapshot for history tracking
    // 3. Check for new milestones

    return NextResponse.json({
      success: true,
      player: result.player,
      message: 'Player data refreshed successfully',
    });
  } catch (error) {
    console.error('Error refreshing player:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to refresh player data' },
      { status: 500 }
    );
  }
}





