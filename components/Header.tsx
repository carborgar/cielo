'use client';

import Link from 'next/link';
import { CloudSun } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/nextjs';

export function Header() {
  return (
    <header className="sticky top-0 z-50 bg-sky-600 dark:bg-sky-900 text-white shadow-md">
      <div className="max-w-3xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg tracking-tight">
          <CloudSun size={24} />
          <span>Cielo</span>
        </Link>
        <div className="flex items-center gap-3">
          <SignedOut>
            <SignInButton mode="modal">
              <button className="text-sm font-medium bg-white/20 hover:bg-white/30 transition px-3 py-1.5 rounded-full">
                Iniciar sesión
              </button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <UserButton
              appearance={{
                elements: {
                  avatarBox: 'w-8 h-8',
                },
              }}
            />
          </SignedIn>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
