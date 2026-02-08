import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';
import { SESSION_COOKIE_NAME } from '@/lib/session';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get(SESSION_COOKIE_NAME)?.value;

    if (!sessionToken) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    // Get user from session
    const user = await prisma.user.findUnique({
      where: { sessionToken },
      select: { id: true },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Get gift exchange status
    const giftExchange = await prisma.giftExchange.findUnique({
      where: { userId: user.id },
      include: {
        targetUser: {
          select: {
            id: true,
            playerNumber: true,
            name: true,
          },
        },
      },
    });

    if (!giftExchange) {
      return NextResponse.json({
        status: 'not_started',
        targetUser: null,
        completedAt: null,
      });
    }

    return NextResponse.json({
      status: giftExchange.status,
      targetUser: giftExchange.targetUser,
      completedAt: giftExchange.status === 'completed' ? giftExchange.updatedAt : null,
    });
  } catch (error) {
    console.error('Error fetching gift exchange status:', error);
    return NextResponse.json(
      { error: 'Failed to fetch gift exchange status' },
      { status: 500 }
    );
  }
}
