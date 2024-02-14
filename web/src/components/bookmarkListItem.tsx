'use client';

import { Delete, Edit, ExternalLink, MoreVertical, Star, Trash2 } from 'lucide-react';
import { Bookmark } from '../lib/types';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export default function BookmarkListItem({ link, title, isFavorite }: Bookmark) {
  function handleToggleFavourite() {
    // first update the ui to show the change
    // then send the request to the server
    // if the request fails, revert the change, and show an error message; otherwise, show no message at all
  }

  function handleEditBookmark() {
    // open a modal with a form to edit the bookmark
  }

  function handleDeleteBookmark() {
    // show a confirmation dialog
    // if the user confirms, send the request to the server
    // if the request fails, show an error message; otherwise, show no message at all and remove the bookmark from the ui
  }

  return (
    <TooltipProvider>
      <Tooltip delayDuration={250}>
        <TooltipTrigger>
          <a href={link} target="_blank">
            <div className="group flex justify-between bg-background text-foreground p-4 rounded-lg">
              <div className="flex items-center gap-2">
                <img
                  className="z-0"
                  height={14}
                  width={14}
                  src={`http://www.google.com/s2/favicons?domain=${link}`}
                />
                <h2 className="font-bold mt-1">{title}</h2>
              </div>
              <div className="flex gap-2">
                <div className="cursor-pointer">
                  <DropdownMenu>
                    <DropdownMenuTrigger>
                      <MoreVertical />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent side="left" className="space-y-1">
                      {/* TODO change category via drag-and-drop in the category page */}
                      <DropdownMenuItem
                        className="flex items-center cursor-pointer gap-1"
                        onClick={handleToggleFavourite}
                      >
                        <Star
                          fill={isFavorite ? '#FFD700 ' : 'none'}
                          color={isFavorite ? '#FFD700 ' : 'black'}
                        />
                        {isFavorite ? 'Unfavourite' : 'Favourite'}
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="flex items-center cursor-pointer gap-1"
                        onClick={handleEditBookmark}
                      >
                        <Edit />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="flex items-center cursor-pointer gap-1 hover:text-destructive"
                        onClick={handleDeleteBookmark}
                      >
                        <Trash2 color="red" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </div>
          </a>
        </TooltipTrigger>

        {/* {bookmark.description && (
          <TooltipContent
            side="bottom"
            className="flex justify-between bg-background text-foreground p-4 rounded-l"
          >
            <p>{bookmark.description}</p>
          </TooltipContent>
        )} */}
      </Tooltip>
    </TooltipProvider>
  );
}
