import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';

/**
 * Get verification status for polling
 */
export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const verificationId = searchParams.get('verificationId');

    if (!verificationId) {
      return NextResponse.json(
        { success: false, error: 'Verification ID is required' },
        { status: 400 }
      );
    }

    // Get verification status
    const verification = await prisma.claimVerification.findUnique({
      where: { id: verificationId },
      select: {
        id: true,
        status: true,
        expiresAt: true,
        verifiedAt: true,
        userId: true,
      },
    });

    if (!verification) {
      return NextResponse.json(
        { success: false, error: 'Verification not found' },
        { status: 404 }
      );
    }

    // Check if user owns this verification
    if (verification.userId !== session.user.id) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 403 }
      );
    }

    // Check if expired
    if (verification.status === 'pending' && verification.expiresAt < new Date()) {
      await prisma.claimVerification.update({
        where: { id: verificationId },
        data: { status: 'expired' },
      });
      return NextResponse.json({
        success: true,
        verification: {
          ...verification,
          status: 'expired',
        },
      });
    }

    return NextResponse.json({
      success: true,
      verification,
    });
  } catch (error) {
    console.error('Error getting verification status:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to get verification status' },
      { status: 500 }
    );
  }
}





