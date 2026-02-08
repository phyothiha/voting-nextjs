import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';
import { SESSION_COOKIE_NAME } from '@/lib/session';

export async function POST() {
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

    // Get user's current gift exchange
    const currentExchange = await prisma.giftExchange.findUnique({
      where: { userId: user.id },
    });

    if (!currentExchange) {
      return NextResponse.json(
        { error: 'Gift exchange not started' },
        { status: 400 }
      );
    }

    if (currentExchange.status === 'completed') {
      return NextResponse.json(
        { error: 'Cannot reassign after completion' },
        { status: 400 }
      );
    }

    // Get total user count (excluding current user and current target)
    const excludeIds = [user.id];
    if (currentExchange.targetUserId) {
      excludeIds.push(currentExchange.targetUserId);
    }

    const userCount = await prisma.user.count({
      where: { id: { notIn: excludeIds } },
    });

    if (userCount === 0) {
      return NextResponse.json(
        { error: 'No other users available' },
        { status: 400 }
      );
    }

    // Get a random user (excluding current user and current target)
    const randomSkip = Math.floor(Math.random() * userCount);
    const randomUser = await prisma.user.findFirst({
      where: { id: { notIn: excludeIds } },
      select: { id: true, playerNumber: true, name: true },
      skip: randomSkip,
    });

    if (!randomUser) {
      return NextResponse.json(
        { error: 'Failed to find random user' },
        { status: 500 }
      );
    }

    // Update gift exchange with new target
    const updatedExchange = await prisma.giftExchange.update({
      where: { userId: user.id },
      data: { targetUserId: randomUser.id },
      include: {
        targetUser: {
          select: { id: true, playerNumber: true, name: true },
        },
      },
    });

    return NextResponse.json({
      targetUser: updatedExchange.targetUser,
    });
  } catch (error) {
    console.error('Error reassigning gift exchange:', error);
    return NextResponse.json(
      { error: 'Failed to reassign gift exchange' },
      { status: 500 }
    );
  }
}
