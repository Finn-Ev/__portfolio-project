'use client';

import { ChevronDown, Edit, Star, Trash2 } from 'lucide-react';
import { Bookmark } from '@/lib/types';

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
import { setFavourite } from '@/lib/actions/bookmarks/favourites/set';
import { toast } from '@/components/ui/toast/use-toast';
import { deleteBookmark } from '@/lib/actions/bookmarks/delete';
import { useRouter } from 'next/navigation';
import BookmarkFormDialog from '@/components/bookmark-form-dialog';
import { useBookmarkListContext } from '@/providers';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

export default function BookmarkListItem({
  id,
  link,
  title,
  isFavourite,
  description,
  categoryId,
}: Bookmark) {
  const t = useTranslations();
  const router = useRouter();

  const {
    expandedBookmarkId,
    setExpandedBookmarkId,
    favouritesAreGettingMutated,
    setFavouritesAreGettingMutated,
  } = useBookmarkListContext();

  const [isFavouriteState, setIsFavouriteState] = useState(isFavourite);
  const isExpanded = expandedBookmarkId === id;

  async function handleToggleFavourite() {
    if (favouritesAreGettingMutated) return;

    setFavouritesAreGettingMutated(true);
    setIsFavouriteState(!isFavouriteState);
    const { success, errorCode } = await setFavourite(id, !isFavourite);

    if (!success) {
      toast({
        title: t('Miscellaneous.genericErrorTitle'),
        description: t(`Miscellaneous.ErrorMessages.${errorCode}`),
        variant: 'destructive',
      });
      setIsFavouriteState(isFavourite);
    }

    setTimeout(() => setFavouritesAreGettingMutated(false), 1500); // prevent spam-clicking and to allow the app to sync the state from the server
    router.refresh();
  }

  async function handleDeleteBookmark() {
    const { success, errorCode } = await deleteBookmark(id);
    if (success) {
      toast({
        title: t('Bookmark.Toast.deleteSuccessMessage'),
      });
    } else {
      toast({
        title: t('Miscellaneous.genericErrorTitle'),
        description: t(`Miscellaneous.ErrorMessages.${errorCode}`),
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
          <div className="w-full flex gap-2 justify-between">
            <div className="flex gap-2 flex-wrap">
              <div className="flex items-center">
                <BookmarkFormDialog
                  bookmarkId={id}
                  defaultValues={{ title, link, description, categoryId: categoryId.toString() }}
                  triggerElement={
                    <div className="flex items-center cursor-pointer gap-1">
                      <Edit />
                      {t('Bookmark.editButtonLabel')}
                    </div>
                  }
                />
              </div>
              <div className="flex items-center cursor-pointer gap-1">
                <AlertDialog>
                  <AlertDialogTrigger className="flex items-center gap-1">
                    <Trash2 />
                    {t('Bookmark.deleteButtonLabel')}
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>{t('Bookmark.DeleteConfirmation.title')}</AlertDialogTitle>
                      <AlertDialogDescription>{t('Bookmark.DeleteConfirmation.text')}</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>
                        {t('Bookmark.DeleteConfirmation.cancelButtonLabel')}
                      </AlertDialogCancel>
                      <AlertDialogAction onClick={handleDeleteBookmark}>
                        {t('Bookmark.DeleteConfirmation.confirmButtonLabel')}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>

            <div className="flex items-center cursor-pointer gap-1" onClick={handleToggleFavourite}>
              <Star
                className={favouritesAreGettingMutated ? 'cursor-wait' : ''}
                fill={isFavouriteState ? '#FFD700' : 'none'}
                color={isFavouriteState ? '#FFD700' : 'black'}
              />
            </div>
          </div>
        </div>
      )}
    </li>
  );
}
