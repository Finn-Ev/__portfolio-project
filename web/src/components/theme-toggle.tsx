'use client';

import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { HTMLAttributes } from 'react';

interface ThemeToggleProps extends HTMLAttributes<HTMLDivElement> {}

export default function ThemeToggle(props: ThemeToggleProps) {
  const { theme, setTheme } = useTheme();

  return (
    <div {...props}>
      {theme === 'light' ? (
        <Moon className="cursor-pointer" onClick={() => setTheme('dark')} />
      ) : (
        <Sun className="cursor-pointer" onClick={() => setTheme('light')} />
      )}
    </div>
  );
}
