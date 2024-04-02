'use client';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { LanguagesIcon } from 'lucide-react';
import { Link } from '@/navigation';

interface LanguageSelectProps extends React.HTMLAttributes<HTMLDivElement> {}

export default function LanguageSelect(props: LanguageSelectProps) {
  return (
    <div className="flex gap-2 mt-auto" {...props}>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <LanguagesIcon />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>
            <Link
              locale="en"
              href=""
              className="flex items-center gap-1"
              onClick={() => window.location.reload()}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 30" width="20" height="15">
                <clipPath id="t">
                  <path d="M25,15h25v15zv15h-25zh-25v-15zv-15h25z" />
                </clipPath>
                <path d="M0,0v30h50v-30z" fill="#012169" />
                <path d="M0,0 50,30M50,0 0,30" stroke="#fff" stroke-width="6" />
                <path d="M0,0 50,30M50,0 0,30" clip-path="url(#t)" stroke="#C8102E" stroke-width="4" />
                <path
                  d="M-1 11h22v-12h8v12h22v8h-22v12h-8v-12h-22z"
                  fill="#C8102E"
                  stroke="#FFF"
                  stroke-width="2"
                />
              </svg>
              English
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Link
              locale="de"
              href=""
              className="flex items-center gap-1"
              onClick={() => window.location.reload()}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="15" viewBox="0 0 5 3">
                <desc>Flag of Germany</desc>
                <rect id="black_stripe" width="5" height="3" y="0" x="0" fill="#000" />
                <rect id="red_stripe" width="5" height="2" y="1" x="0" fill="#D00" />
                <rect id="gold_stripe" width="5" height="1" y="2" x="0" fill="#FFCE00" />
              </svg>
              Deutsch
            </Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
