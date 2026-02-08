import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // Fetch all gift exchanges
    const exchanges = await prisma.giftExchange.findMany({
      include: {
        user: {
          select: { playerNumber: true, name: true },
        },
        targetUser: {
          select: { playerNumber: true, name: true },
        },
      },
      orderBy: { updatedAt: 'desc' },
    });

    // Calculate statistics
    const total = exchanges.length;
    const searching = exchanges.filter((e) => e.status === 'searching').length;
    const completed = exchanges.filter((e) => e.status === 'completed').length;

    // Format exchanges for response
    const formattedExchanges = exchanges.map((exchange) => ({
      giver: exchange.user.name,
      giverPlayerNumber: exchange.user.playerNumber,
      receiver: exchange.targetUser?.name || 'Not assigned',
      receiverPlayerNumber: exchange.targetUser?.playerNumber || 'N/A',
      status: exchange.status,
      updatedAt: exchange.updatedAt.toISOString(),
    }));

    return NextResponse.json({
      exchanges: formattedExchanges,
      stats: {
        total,
        searching,
        completed,
      },
    });
  } catch (error) {
    console.error('Error fetching gift exchanges:', error);
    return NextResponse.json(
      { error: 'Failed to fetch gift exchanges' },
      { status: 500 }
    );
  }
}
