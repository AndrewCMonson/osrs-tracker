import { NextRequest, NextResponse } from 'next/server';
import { lookupPlayer } from '@/services/player';
import { calculatePlayerMilestones, getNearest99s } from '@/services/milestone';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  try {
    const { username } = await params;
    const decodedUsername = decodeURIComponent(username);
    
    const result = await lookupPlayer(decodedUsername);

    if (!result.success || !result.player) {
      return NextResponse.json(
        { success: false, error: result.error || 'Player not found' },
        { status: 404 }
      );
    }

    const player = result.player;
    const allMilestones = calculatePlayerMilestones(player);
    const nearest99s = getNearest99s(player, 5);

    // Categorize milestones
    const achieved = allMilestones.filter((m) => m.status === 'achieved');
    const inProgress = allMilestones
      .filter((m) => m.status === 'in_progress')
      .sort((a, b) => b.progress - a.progress);

    // Get milestone stats
    const stats = {
      totalMilestones: allMilestones.length,
      achieved: achieved.length,
      inProgress: inProgress.length,
      completionPercentage: (achieved.length / allMilestones.length) * 100,
    };

    return NextResponse.json({
      success: true,
      username: player.username,
      stats,
      nearest99s,
      achieved: achieved.slice(0, 50), // Limit to 50 for performance
      inProgress: inProgress.slice(0, 50),
    });
  } catch (error) {
    console.error('Error fetching milestones:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch milestones' },
      { status: 500 }
    );
  }
}









