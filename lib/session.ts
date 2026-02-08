import { randomBytes } from 'crypto';

// Cookie configuration
export const SESSION_COOKIE_NAME = 'session_token';

export const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  maxAge: 60 * 60 * 24 * 30, // 30 days in seconds
  path: '/',
};

// Generate a cryptographically secure session token
export function generateSessionToken(): string {
  return randomBytes(32).toString('hex');
}

// Generate a random player number in the format "###" where ### is between 100-249
export function generatePlayerNumber(): string {
  // const number = Math.floor(Math.random() * 900) + 100;
  const number = Math.floor(Math.random() * 150) + 100; // 100-249 (150 possibilities)
  
  return `${number}`;
}
