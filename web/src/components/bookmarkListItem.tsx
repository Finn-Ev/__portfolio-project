'use client';

import { MoreVertical } from 'lucide-react';
import { Bookmark } from '../lib/types';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface BookmarkListItemProps {
  bookmark: Bookmark;
}

export default function BookmarkListItem({ bookmark }: BookmarkListItemProps) {
  return (
    <TooltipProvider>
      <Tooltip delayDuration={250}>
        <TooltipTrigger>
          <div className="group flex justify-between bg-background text-foreground p-4 rounded-lg">
            <a href={bookmark.link} target="_blank" className="flex items-center gap-2">
              <img
                className="z-0"
                height={18}
                width={18}
                src={`http://www.google.com/s2/favicons?domain=${bookmark.link}`}
              />
              <h2 className="font-bold">{bookmark.title}</h2>
            </a>
            <div className="flex gap-2">
              {/* <a
          href={bookmark.link}
          className="opacity-0 group-hover:opacity-100 transition-opacity"
          target="_blank"
        >
          <ExternalLink />
        </a> */}
              <div className="opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                <MoreVertical />
                {/* This menu will display actions for marking the bookmark as a favourite, to edit it and to delete it */}
                {/* https://ui.shadcn.com/docs/components/dropdown-menu */}
              </div>
            </div>
          </div>
        </TooltipTrigger>

        {bookmark.description && (
          <TooltipContent
            side="bottom"
            className="flex justify-between bg-background text-foreground p-4 rounded-l"
          >
            <p>{bookmark.description}</p>
          </TooltipContent>
        )}
      </Tooltip>
    </TooltipProvider>
  );
}
