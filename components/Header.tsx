import Link from 'next/link';
import { CloudSun } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';

export function Header() {
  return (
    <header className="sticky top-0 z-50 bg-sky-600 dark:bg-sky-900 text-white shadow-md">
      <div className="max-w-3xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg tracking-tight">
          <CloudSun size={24} />
          <span>Fancy AEMET</span>
        </Link>
        <ThemeToggle />
      </div>
    </header>
  );
}

