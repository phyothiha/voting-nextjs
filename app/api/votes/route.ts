import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';
import { SESSION_COOKIE_NAME } from '@/lib/session';

// GET handler - Get user's voting history
export async function GET() {
  try {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get(SESSION_COOKIE_NAME)?.value;

    if (!sessionToken) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    // Get user from session token
    const user = await prisma.user.findUnique({
      where: { sessionToken },
      select: { id: true },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid session' },
        { status: 401 }
      );
    }

    // Get all votes with agendaId and eventId
    const votes = await prisma.vote.findMany({
      where: { userId: user.id },
      select: { agendaId: true, eventId: true },
    });

    return NextResponse.json({ votes });
  } catch (error) {
    console.error('Error fetching voting history:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST handler - Submit a vote (ONE TIME ONLY per agenda)
export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get(SESSION_COOKIE_NAME)?.value;

    if (!sessionToken) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    // Get user from session token
    const user = await prisma.user.findUnique({
      where: { sessionToken },
      select: { id: true },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid session' },
        { status: 401 }
      );
    }

    // Parse request body
    const body = await request.json();
    const { eventId, agendaId } = body;

    // Validate input
    if (!eventId || !agendaId) {
      return NextResponse.json(
        { error: 'eventId and agendaId are required' },
        { status: 400 }
      );
    }

    // Verify event exists and belongs to the specified agenda
    const event = await prisma.event.findUnique({
      where: { id: eventId },
      select: { agendaId: true },
    });

    if (!event) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      );
    }

    if (event.agendaId !== agendaId) {
      return NextResponse.json(
        { error: 'Event does not belong to the specified agenda' },
        { status: 400 }
      );
    }

    // Check if user already voted for this agenda
    const existingVote = await prisma.vote.findUnique({
      where: {
        userId_agendaId: {
          userId: user.id,
          agendaId: agendaId,
        },
      },
    });

    if (existingVote) {
      return NextResponse.json(
        { error: 'You have already voted for this agenda' },
        { status: 400 }
      );
    }

    // Create new vote
    await prisma.vote.create({
      data: {
        userId: user.id,
        eventId: eventId,
        agendaId: agendaId,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error submitting vote:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
