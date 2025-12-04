import { NextRequest, NextResponse } from 'next/server';
import { lookupPlayer } from '@/services/player';
import { savePlayerSnapshot } from '@/services/snapshot';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  try {
    const { username } = await params;
    const decodedUsername = decodeURIComponent(username);
    
    // Fetch latest player data from OSRS hiscores
    const result = await lookupPlayer(decodedUsername);

    if (!result.success || !result.player) {
      return NextResponse.json(
        { success: false, error: result.error || 'Player not found' },
        { status: 404 }
      );
    }

    // Save snapshot with force=true to bypass 1-hour cooldown
    await savePlayerSnapshot(result.player, true);

    return NextResponse.json({
      success: true,
      message: 'Snapshot saved successfully',
    });
  } catch (error) {
    console.error('Error saving snapshot:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to save snapshot' },
      { status: 500 }
    );
  }
}




