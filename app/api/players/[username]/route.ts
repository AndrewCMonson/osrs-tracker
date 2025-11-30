import { NextRequest, NextResponse } from 'next/server';
import { lookupPlayer } from '@/services/player';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  try {
    const { username } = await params;
    const decodedUsername = decodeURIComponent(username);
    
    const result = await lookupPlayer(decodedUsername);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      player: result.player,
    });
  } catch (error) {
    console.error('Error fetching player:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch player data' },
      { status: 500 }
    );
  }
}


