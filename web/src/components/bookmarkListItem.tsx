'use client';

import { Delete, Edit, ExternalLink, MoreVertical, Star, Trash2 } from 'lucide-react';
import { Bookmark } from '../lib/types';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
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
import { getAllFavourites } from '../lib/actions/bookmarks/favourites/getAll';
import { setFavourite } from '../lib/actions/bookmarks/favourites/set';
import { useToast } from './ui/toast/use-toast';
import { Button } from './ui/button';
import { deleteBookmark } from '../lib/actions/bookmarks/delete';
import { useRouter } from 'next/navigation';

export default function BookmarkListItem({ link, title, isFavourite, id }: Bookmark) {
  const router = useRouter();
  const { toast } = useToast();

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const [isFavouriteUIState, setIsFavouriteUIState] = useState(isFavourite);

  async function handleToggleFavourite() {
    setIsFavouriteUIState(!isFavouriteUIState);

    const { success, errorMessage } = await setFavourite(id, !isFavouriteUIState); // react has not yet updated the state here, so we need to use the opposite of isFavouriteUIState

    if (!success) {
      setIsFavouriteUIState(isFavouriteUIState);
      toast({
        title: 'Error',
        description: errorMessage ?? 'Something went wrong. Please try again.',
        variant: 'destructive',
      });
    }
  }

  function handleEditBookmark() {
    // open a modal with a form to edit the bookmark
  }

  async function handleDeleteBookmark() {
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

    router.refresh(); // refresh the page to reflect the changes

    setIsDeleteDialogOpen(false);
  }

  return (
    <>
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
                  <MoreVertical height={30} width={30} className="p-1" />
                </DropdownMenuTrigger>
                <DropdownMenuContent side="left" className="space-y-1">
                  {/* TODO change category via drag-and-drop in the category page */}
                  <DropdownMenuItem
                    className="flex items-center cursor-pointer gap-1"
                    onClick={handleToggleFavourite}
                  >
                    <Star
                      fill={isFavouriteUIState ? '#FFD700 ' : 'none'}
                      color={isFavouriteUIState ? '#FFD700 ' : 'black'}
                    />
                    {isFavouriteUIState ? 'Unfavourite' : 'Favourite'}
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
                    onClick={() => setIsDeleteDialogOpen(true)}
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

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the bookmark.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <Button variant={'outline'} onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant={'destructive'} onClick={handleDeleteBookmark}>
              Delete bookmark
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
