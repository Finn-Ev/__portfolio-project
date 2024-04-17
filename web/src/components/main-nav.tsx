'use client';

import { AlignLeft, Book, PanelTopClose, Star, User } from 'lucide-react';
import ThemeToggle from '@/components/theme-toggle';
import { useState } from 'react';
import { cn } from '@/lib/utils/cn';
import Link from 'next/link';
import LanguageSelect from '@/components/language-select';
import { useTranslations } from 'next-intl';

export default function MainNav() {
  const t = useTranslations();
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="fade-in-20 min-h-full h-auto bg-background">
      <div
        className={cn(
          'min-h-screen h-full flex items-start flex-col gap-4 mx-auto pl-4 md:p-4 transition-all duration-150',
          expanded ? 'w-[200px]' : 'w-[60px]',
        )}
      >
        <div className="flex justify-between w-full">
          <PanelTopClose
            className={cn(
              'hidden md:block transition-transform duration-300 cursor-pointer z-10 ',
              expanded ? '-rotate-90' : 'rotate-90',
            )}
            onClick={() => setExpanded(!expanded)}
          />

          {/* Desktop - additional dynamic sidebar content */}
          {expanded && (
            <>
              <ThemeToggle />

              <Link onClick={() => setExpanded(false)} href={'/bookmarks/settings'}>
                <User />
              </Link>
            </>
          )}
          {/* Mobile - additional static sidebar content */}
        </div>

        <hr className="hidden md:block bg-foreground text-foreground h-px w-full my-1" />

        <Link href={'/bookmarks'} className="flex gap-2  h-7" onClick={() => setExpanded(false)}>
          <AlignLeft className="cursor-pointer" />

          <span
            className={cn(
              'mt-[2px] transition-opacity duration-100',
              expanded ? 'opacity-100 duration-500' : 'opacity-0  duration-100 pointer-events-none',
            )}
          >
            {t('Navbar.bookmarksLinkLabel')}
          </span>
        </Link>

        <Link href={'/bookmarks/categories'} className="flex gap-2 h-7" onClick={() => setExpanded(false)}>
          <Book />
          <span
            className={cn(
              'mt-[2px] transition-opacity',
              expanded ? 'opacity-100 duration-500' : 'opacity-0 duration-100 pointer-events-none',
            )}
          >
            {t('Navbar.categoriesLinkLabel')}
          </span>
        </Link>

        <Link href={'/bookmarks/favourites'} className="flex gap-2 h-7" onClick={() => setExpanded(false)}>
          <Star />
          <span
            className={cn(
              'mt-[2px] transition-opacity',
              expanded ? 'opacity-100 duration-500' : 'opacity-0 duration-100 pointer-events-none',
            )}
          >
            {t('Navbar.favouritesLinkLabel')}
          </span>
        </Link>

        {/* Mobile - additional static sidebar content */}
        <Link className="md:mt-0 md:hidden" onClick={() => setExpanded(false)} href={'/bookmarks/settings'}>
          <User />
        </Link>

        <ThemeToggle className="md:hidden mt-2 " />
        {/* Mobile - additional static sidebar content */}

        <LanguageSelect className="mt-2 md:mt-auto" />
      </div>
    </div>
  );
}
