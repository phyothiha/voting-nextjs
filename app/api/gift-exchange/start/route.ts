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

    // Check if user already has a gift exchange record
    const existingExchange = await prisma.giftExchange.findUnique({
      where: { userId: user.id },
    });

    if (existingExchange && existingExchange.status === 'completed') {
      return NextResponse.json(
        { error: 'Exchange already completed' },
        { status: 400 }
      );
    }

    // Get total user count (excluding current user)
    const userCount = await prisma.user.count({
      where: { id: { not: user.id } },
    });

    if (userCount === 0) {
      return NextResponse.json(
        { error: 'No other users available' },
        { status: 400 }
      );
    }

    // Get a random user (excluding current user)
    const randomSkip = Math.floor(Math.random() * userCount);
    const randomUser = await prisma.user.findFirst({
      where: { id: { not: user.id } },
      select: { id: true, playerNumber: true, name: true },
      skip: randomSkip,
    });

    if (!randomUser) {
      return NextResponse.json(
        { error: 'Failed to find random user' },
        { status: 500 }
      );
    }

    // Create or update gift exchange record
    const giftExchange = await prisma.giftExchange.upsert({
      where: { userId: user.id },
      create: {
        userId: user.id,
        targetUserId: randomUser.id,
        status: 'searching',
      },
      update: {
        targetUserId: randomUser.id,
        status: 'searching',
      },
      include: {
        targetUser: {
          select: { id: true, playerNumber: true, name: true },
        },
      },
    });

    return NextResponse.json({
      targetUser: giftExchange.targetUser,
    });
  } catch (error) {
    console.error('Error starting gift exchange:', error);
    return NextResponse.json(
      { error: 'Failed to start gift exchange' },
      { status: 500 }
    );
  }
}
