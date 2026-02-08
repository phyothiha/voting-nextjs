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

    // Get user's gift exchange
    const giftExchange = await prisma.giftExchange.findUnique({
      where: { userId: user.id },
    });

    if (!giftExchange) {
      return NextResponse.json(
        { error: 'Gift exchange not started' },
        { status: 400 }
      );
    }

    if (giftExchange.status === 'completed') {
      return NextResponse.json(
        { error: 'Exchange already completed' },
        { status: 400 }
      );
    }

    if (giftExchange.status !== 'searching') {
      return NextResponse.json(
        { error: 'Invalid exchange status' },
        { status: 400 }
      );
    }

    // Update status to completed
    await prisma.giftExchange.update({
      where: { userId: user.id },
      data: { status: 'completed' },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error confirming gift exchange:', error);
    return NextResponse.json(
      { error: 'Failed to confirm gift exchange' },
      { status: 500 }
    );
  }
}
