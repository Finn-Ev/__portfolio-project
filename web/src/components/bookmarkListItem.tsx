'use client';

import { Edit, MoreVertical, Star, Trash2 } from 'lucide-react';
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
import { useState } from 'react';
import { setFavourite } from '../lib/actions/bookmarks/favourites/set';
import { useToast } from './ui/toast/use-toast';
import { deleteBookmark } from '../lib/actions/bookmarks/delete';
import { useRouter } from 'next/navigation';
import BookmarkFormDialog from './bookmarkForm';
import { useOutsideClick } from '../lib/utils';

export default function BookmarkListItem({ id, link, title, isFavourite, description }: Bookmark) {
  //   const [expanded, setExpanded] = useState(false);
  const [showDropdownMenu, setShowDropdown] = useState(false);

  const dropdownRef = useOutsideClick(() => {
    // setShowDropdown(false);
  });

  const router = useRouter();
  const { toast } = useToast();

  async function handleToggleFavourite() {
    const { success, errorMessage } = await setFavourite(id, !isFavourite); // react has not yet updated the state here, so we need to use the opposite of isFavouriteUIState

    if (success) {
      toast({
        title: 'Bookmark updated',
        description: `The bookmark has been ${isFavourite ? 'unfavourited' : 'favourited'}.`,
        variant: 'success',
      });
    } else {
      toast({
        title: 'Error',
        description: errorMessage ?? 'Something went wrong. Please try again.',
        variant: 'destructive',
      });
    }

    setShowDropdown(false);
    router.refresh();
  }

  function handleEditBookmark() {
    // open a modal with a form to edit the bookmark
  }

  async function handleDeleteBookmark() {
    setShowDropdown(false);
    const { success, errorMessage } = await deleteBookmark(id);
    if (success) {
      toast({
        title: 'Bookmark deleted',
        description: 'The bookmark has been deleted.',
        variant: 'success',
      });
    } else {
      toast({
        title: 'Error',
        description: errorMessage ?? 'Something went wrong. Please try again.',
        variant: 'destructive',
      });
    }

    router.refresh();
  }

  return (
    <>
      <div>
        <div className="group relative flex justify-between items-center bg-background text-foreground p-4 rounded-lg">
          <a href={link} target="_blank" className="flex items-center gap-2 hover:underline select-none">
            <img
              className="z-0"
              height={14}
              width={14}
              src={`http://www.google.com/s2/favicons?domain=${link}`}
            />
            <h2 className="font-bold mt-1">{title}</h2>
          </a>

          <div className="flex items-center gap-3">
            {/* {description && (
              <div
                className="cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => setExpanded(!expanded)}
              >
                <NotebookIcon />
              </div>
            )} */}

            {/* <a href={link} className="opacity-0 group-hover:opacity-100 transition-opacity" target="_blank">
              <ExternalLink />
            </a> */}
            <div className="flex gap-2">
              <div className="cursor-pointer relative">
                <MoreVertical onClick={() => setShowDropdown(!showDropdownMenu)} />

                {showDropdownMenu && (
                  <div
                    ref={dropdownRef}
                    className="absolute z-10 shadow-xl border border-gray-200 right-6 -top-[200%] flex flex-col justify-center gap-2 bg-background p-4 rounded-xl "
                  >
                    <div className="flex items-center cursor-pointer gap-1" onClick={handleToggleFavourite}>
                      <Star
                        fill={isFavourite ? '#FFD700 ' : 'none'}
                        color={isFavourite ? '#FFD700 ' : 'black'}
                      />
                      {isFavourite ? 'Unfavourite' : 'Favourite'}
                    </div>
                    <div onClick={handleEditBookmark}>
                      <BookmarkFormDialog
                        onClose={() => setShowDropdown(false)}
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
                            <AlertDialogAction onClick={handleDeleteBookmark}>
                              Delete bookmark
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        {/* {expanded && (
          <div className="absolute bg-background text-foreground p-4  w-max mr-4">
            <p>{description}</p>
          </div>
        )} */}
      </div>
    </>
  );
}
