import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';
import {
  generateUsername,
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
      return NextResponse.json({ username: null });
    }

    // Query database for user with this session token
    const user = await prisma.user.findUnique({
      where: { sessionToken },
      select: { username: true },
    });

    if (!user) {
      return NextResponse.json({ username: null });
    }

    return NextResponse.json({ username: user.username });
  } catch (error) {
    console.error('Error checking session:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST handler - Generate new username and session
export async function POST() {
  try {
    const username = generateUsername();
    const sessionToken = generateSessionToken();

    // Store user in database
    const user = await prisma.user.create({
      data: {
        username,
        sessionToken,
      },
    });

    // Create response with username
    const response = NextResponse.json({ username: user.username });

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
