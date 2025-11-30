/**
 * API route to fetch player progress history
 * 
 * NOTE: Returns empty data if database is not set up yet.
 * The chart component will show an empty state message.
 */
import { NextRequest, NextResponse } from 'next/server';
import { getAllSkillsHistory, getTotalXpHistory } from '@/services/snapshot';
import { normalizeUsername } from '@/lib/utils';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  try {
    const { username } = await params;
    const normalized = normalizeUsername(username);
    
    // Get time period parameters from query string
    const { searchParams } = new URL(request.url);
    const period = (searchParams.get('period') || 'all') as 'day' | 'week' | 'month' | 'year' | 'all' | 'custom';
    const customStart = searchParams.get('start') ? new Date(searchParams.get('start')!) : undefined;
    const customEnd = searchParams.get('end') ? new Date(searchParams.get('end')!) : undefined;

    const [skillsHistory, totalHistory] = await Promise.all([
      getAllSkillsHistory(normalized, period, customStart, customEnd),
      getTotalXpHistory(normalized, period, customStart, customEnd),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        skills: skillsHistory,
        total: totalHistory,
      },
    });
  } catch (error) {
    console.error('Failed to fetch player history:', error);
    // Return empty data instead of error if database isn't set up
    return NextResponse.json({
      success: true,
      data: {
        skills: [],
        total: [],
      },
    });
  }
}

