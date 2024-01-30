'use client';

import { AlignLeft, Info, List, PanelTopClose, Star } from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import { useEffect, useState } from 'react';
import { cn } from '../lib/utils';
import Link from 'next/link';

export default function MainNav() {
  const [expanded, setExpanded] = useState(false);
  const [initialised, setInitialised] = useState(false);

  //   useEffect(() => {
  //     const navExpanded = localStorage.getItem('navExpanded');
  //     if (navExpanded) {
  //       setExpanded(navExpanded === 'true');
  //       setInitialised(true);
  //     }
  //   }, []);

  //   function setExpandedAndStore(expanded: boolean) {
  //     setExpanded(expanded);
  //     localStorage.setItem('navExpanded', expanded.toString());
  //   }

  //   if (!initialised) {
  //     return null;
  //   }

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
            //   onClick={() => setExpandedAndStore(!expanded)}
            onClick={() => setExpanded(!expanded)}
          />

          {expanded && (
            <>
              <Link
                href={'/'}
                className={
                  cn()
                  //   'transition-opacity',
                  //   expanded ? 'opacity-100 duration-500' : 'opacity-0 h-0 w-0  hidden duration-100',
                }
              >
                <ThemeToggle />
              </Link>

              <Link
                href={'/'}
                className={
                  cn()
                  //   'transition-opacity',
                  //   expanded ? 'opacity-100 duration-500' : 'opacity-0 h-0 w-0 duration-100',
                }
              >
                <Info />
              </Link>
            </>
          )}
        </div>

        <hr className="bg-foreground text-foreground h-px w-full my-1" />

        <Link href={'/'} className="flex gap-2  h-7">
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

        <Link href={'/'} className="flex gap-2 h-7">
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
