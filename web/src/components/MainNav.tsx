'use client';

import { AlignLeft, Info, List, PanelTopClose, Star, User } from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import { useState } from 'react';
import { cn } from '../lib/utils';
import Link from 'next/link';

export default function MainNav() {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="fade-in-20 h-screen bg-background">
      <div
        className={cn(
          'h-full flex items-start flex-col gap-4 mx-auto p-4 transition-all duration-150',
          expanded ? 'w-[200px]' : 'w-[60px]',
        )}
      >
        <div className="flex justify-between w-full">
          <PanelTopClose
            className={cn(
              'transition-transform duration-300 cursor-pointer z-10',
              expanded ? '-rotate-90' : 'rotate-90',
            )}
            onClick={() => setExpanded(!expanded)}
          />

          {expanded && (
            <>
              <div
                className={
                  cn()
                  //   'transition-opacity',
                  //   expanded ? 'opacity-100 duration-500' : 'opacity-0 h-0 w-0  hidden duration-100',
                }
              >
                <ThemeToggle />
              </div>

              <Link
                onClick={() => setExpanded(false)}
                href={'/bookmarks/profile'}
                className={
                  cn()
                  //   'transition-opacity',
                  //   expanded ? 'opacity-100 duration-500' : 'opacity-0 h-0 w-0 duration-100',
                }
              >
                <User />
              </Link>
            </>
          )}
        </div>

        <hr className="bg-foreground text-foreground h-px w-full my-1" />

        <Link href={'/bookmarks'} className="flex gap-2  h-7" onClick={() => setExpanded(false)}>
          <AlignLeft className="cursor-pointer" />

          <span
            className={cn(
              'mt-[2px] transition-opacity duration-100',
              expanded ? 'opacity-100 duration-500' : 'opacity-0  duration-100',
            )}
          >
            Bookmarks
          </span>
        </Link>

        <Link href={'/bookmarks/favourites'} className="flex gap-2 h-7" onClick={() => setExpanded(false)}>
          <Star />
          <span
            className={cn(
              'mt-[2px] transition-opacity',
              expanded ? 'opacity-100 duration-500' : 'opacity-0 duration-100',
            )}
          >
            Favourites
          </span>
        </Link>
      </div>
    </div>
  );
}
