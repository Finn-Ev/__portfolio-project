'use client';

import { ChevronDown, Edit, Star, Trash2 } from 'lucide-react';
import { Bookmark } from '../lib/types';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { setFavourite } from '../lib/actions/bookmarks/favourites/set';
import { useToast } from './ui/toast/use-toast';
import { deleteBookmark } from '../lib/actions/bookmarks/delete';
import { useRouter } from 'next/navigation';
import BookmarkFormDialog from './bookmark-form-dialog';

interface BookmarkListItemProps extends Bookmark {
  isExpanded: boolean;
  setExpandedBookmarkId: (id: number | null) => void;
}

export default function BookmarkListItem({
  id,
  link,
  title,
  isFavourite,
  description,
  isExpanded,
  setExpandedBookmarkId,
}: BookmarkListItemProps) {
  const router = useRouter();
  const { toast } = useToast();

  async function handleToggleFavourite() {
    const { success, errorMessage } = await setFavourite(id, !isFavourite); // react has not yet updated the state here, so we need to use the opposite of isFavouriteUIState

    if (success) {
      toast({
        title: 'Bookmark updated',
        description: `The bookmark has been marked as  ${isFavourite ? 'no' : 'a'} favourite.`,
      });
    } else {
      toast({
        title: 'Error',
        description: errorMessage ?? 'Something went wrong. Please try again.',
        variant: 'destructive',
      });
    }

    setExpandedBookmarkId(null);
    router.refresh();
  }

  async function handleDeleteBookmark() {
    const { success, errorMessage } = await deleteBookmark(id);
    if (success) {
      toast({
        title: 'Bookmark deleted',
        description: 'The bookmark has been deleted.',
      });
    } else {
      toast({
        title: 'Error',
        description: errorMessage ?? 'Something went wrong. Please try again.',
        variant: 'destructive',
      });
    }

    setExpandedBookmarkId(null);
    router.refresh();
  }

  return (
    <li className="p-4 bg-background text-foreground rounded-lg">
      <div className="relative flex justify-between items-center">
        <a href={link} target="_blank" className="flex items-center gap-2 hover:underline select-none">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            alt="ICON"
            className="z-0"
            height={14}
            width={14}
            src={`http://www.google.com/s2/favicons?domain=${link}`}
          />
          <h2 className="font-bold">{title}</h2>
        </a>

        <div className="flex items-center gap-3">
          <div className="flex gap-2">
            <div className="cursor-pointer">
              <ChevronDown
                onClick={isExpanded ? () => setExpandedBookmarkId(null) : () => setExpandedBookmarkId(id)}
                className={`${isExpanded ? 'rotate-180' : ''}`}
              />
            </div>
          </div>
        </div>
      </div>
      {isExpanded && (
        <div className="flex flex-col mt-2 select-none">
          {description && (
            <div className="bg-background leading-7 text-foreground mb-2">
              <p className="overflow-x-auto">{description}</p>
            </div>
          )}
          <div className="w-full flex justify-between gap-2 ">
            <div className="flex items-center cursor-pointer gap-1" onClick={handleToggleFavourite}>
              <Star fill={isFavourite ? '#FFD700' : 'none'} color={isFavourite ? '#FFD700' : 'black'} />
              {isFavourite ? 'Unfavourite' : 'Favourite'}
            </div>
            <div>
              <BookmarkFormDialog
                // onClose={() => setExpandedBookmarkId(null)}
                bookmarkId={id}
                defaultValues={{ title, link, description }}
                triggerElement={
                  <div className="flex items-center cursor-pointer gap-1">
                    <Edit />
                    Edit
                  </div>
                }
              />
            </div>
            <div className="flex items-center cursor-pointer gap-1">
              <AlertDialog>
                <AlertDialogTrigger className="flex items-center gap-1">
                  <Trash2 />
                  Delete
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete the bookmark.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDeleteBookmark}>Delete bookmark</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </div>
      )}
    </li>
  );
}
