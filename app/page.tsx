'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

export default function Home() {
  const [username, setUsername] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  // Check for existing session on mount
  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await fetch('/api/session');
        const data = await response.json();
        setUsername(data.username);
      } catch (error) {
        console.error('Error checking session:', error);
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, []);

  // Generate a new username
  const handleGenerateUsername = async () => {
    setGenerating(true);
    try {
      const response = await fetch('/api/session', {
        method: 'POST',
      });
      const data = await response.json();
      setUsername(data.username);
    } catch (error) {
      console.error('Error generating username:', error);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
        <Image
          className="dark:invert"
          src="/next.svg"
          alt="Next.js logo"
          width={100}
          height={20}
          priority
        />
        <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">
          <h1 className="max-w-xs text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
            Voting App
          </h1>
          
          {loading ? (
            <p className="text-lg text-zinc-600 dark:text-zinc-400">
              Loading...
            </p>
          ) : username ? (
            <div className="flex flex-col gap-4">
              <p className="text-lg text-zinc-600 dark:text-zinc-400">
                Welcome back!
              </p>
              <div className="rounded-lg bg-zinc-100 dark:bg-zinc-900 px-6 py-4">
                <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
                  Your username
                </p>
                <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
                  {username}
                </p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              <p className="max-w-md text-lg leading-8 text-zinc-600 dark:text-zinc-400">
                Get started by generating a random username. Your username will persist across browser tabs.
              </p>
              <button
                onClick={handleGenerateUsername}
                disabled={generating}
                className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-foreground px-5 text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc] disabled:opacity-50 disabled:cursor-not-allowed sm:w-auto"
              >
                {generating ? 'Generating...' : 'Generate Username'}
              </button>
            </div>
          )}
        </div>
        <div className="flex flex-col gap-4 text-base font-medium sm:flex-row">
          <a
            className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-foreground px-5 text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc] md:w-[158px]"
            href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              className="dark:invert"
              src="/vercel.svg"
              alt="Vercel logomark"
              width={16}
              height={16}
            />
            Deploy Now
          </a>
          <a
            className="flex h-12 w-full items-center justify-center rounded-full border border-solid border-black/[.08] px-5 transition-colors hover:border-transparent hover:bg-black/[.04] dark:border-white/[.145] dark:hover:bg-[#1a1a1a] md:w-[158px]"
            href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            Documentation
          </a>
        </div>
      </main>
    </div>
  );
}
