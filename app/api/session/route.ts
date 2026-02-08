import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';
import {
  generatePlayerNumber,
  generateSessionToken,
  SESSION_COOKIE_NAME,
  COOKIE_OPTIONS,
} from '@/lib/session';

// GET handler - Check existing session
export async function GET() {
  try {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get(SESSION_COOKIE_NAME)?.value;

    if (!sessionToken) {
      return NextResponse.json({ user: null });
    }

    // Query database for user with this session token
    const user = await prisma.user.findUnique({
      where: { sessionToken },
      select: { 
        playerNumber: true,
        name: true,
        department: true,
      },
    });

    if (!user) {
      return NextResponse.json({ user: null });
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.error('Error checking session:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST handler - Generate new player number and session
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, department } = body;

    // Validate name is provided
    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return NextResponse.json(
        { error: 'Name is required' },
        { status: 400 }
      );
    }

    // Generate unique player number
    let playerNumber: string;
    let isUnique = false;
    let attempts = 0;
    const maxAttempts = 50;

    while (!isUnique && attempts < maxAttempts) {
      playerNumber = generatePlayerNumber();
      const existing = await prisma.user.findUnique({
        where: { playerNumber },
      });
      if (!existing) {
        isUnique = true;
      }
      attempts++;
    }

    if (!isUnique) {
      return NextResponse.json(
        { error: 'Unable to generate unique player number. Please try again.' },
        { status: 500 }
      );
    }

    const sessionToken = generateSessionToken();

    // Store user in database
    const user = await prisma.user.create({
      data: {
        playerNumber: playerNumber!,
        name: name.trim(),
        department: department && typeof department === 'string' ? department.trim() : null,
        sessionToken,
      },
    });

    // Create response with user data
    const response = NextResponse.json({ 
      user: {
        playerNumber: user.playerNumber,
        name: user.name,
        department: user.department,
      }
    });

    // Set HTTP-only cookie
    response.cookies.set(SESSION_COOKIE_NAME, sessionToken, COOKIE_OPTIONS);

    return response;
  } catch (error) {
    console.error('Error creating session:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
