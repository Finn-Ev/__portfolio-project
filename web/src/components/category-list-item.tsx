import { Edit, Trash2 } from 'lucide-react';
import { Category } from '@/lib/types/category';
import BookmarkList from '@/components/bookmark-list';
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
import { deleteCategory } from '@/lib/actions/categories/delete';
import { toast } from '@/components/ui/toast/use-toast';
import { useRouter } from 'next/navigation';
import CategoryFormDialog from '@/components/category-form-dialog';
import { useTranslations } from 'next-intl';

const ROOT_CATEGORY_TITLE = '__ROOT__';

interface CategoryListItemProps {
  category: Category;
}

export default function CategoryListItem({ category }: CategoryListItemProps) {
  const t = useTranslations();
  const router = useRouter();

  const isRootCategory = category.title === ROOT_CATEGORY_TITLE;
  const categoryIsEmpty = category.bookmarks.length === 0;

  const handleDeleteCategory = async () => {
    const { success, errorCode } = await deleteCategory(category.id);

    if (success) {
      toast({
        title: t('Category.Toast.deleteSuccessMessage'),
      });
    } else {
      toast({
        title: t('Miscellaneous.genericErrorTitle'),
        description: t(`Miscellaneous.ErrorMessages.${errorCode}`),
        variant: 'destructive',
      });
    }

    router.refresh();
  };

  if (isRootCategory && categoryIsEmpty) {
    return null;
  }

  if (isRootCategory && !categoryIsEmpty) {
    return (
      <>
        <hr className="mt-6" />
        <div className="mt-3">
          <div>
            <h2 className="mb-2">{t('Category.uncategorisedBookmarksText')}</h2>
          </div>
          <div>
            <BookmarkList bookmarks={category.bookmarks} />
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="mb-8">
        <div className="bg-background rounded-lg p-4">
          <div className="flex justify-between">
            <div>
              <h2 className="font-semibold">{category.title}</h2>
              {category.description && <p className="mt-3 mb-2">{category.description}</p>}
            </div>
          </div>
          <div>
            <div className="flex flex-wrap justify-end items-center cursor-pointer gap-3">
              <CategoryFormDialog
                categoryId={category.id}
                defaultValues={{ description: category.description, title: category.title }}
                triggerElement={
                  <div className="flex items-center cursor-pointer gap-1">
                    <Edit />
                    {t('Category.editButtonLabel')}
                  </div>
                }
              />
              <AlertDialog>
                <AlertDialogTrigger className="flex items-center gap-1">
                  <Trash2 />
                  {t('Category.deleteButtonLabel')}
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>{t('Category.DeleteConfirmation.title')}</AlertDialogTitle>
                    <AlertDialogDescription>{t('Category.DeleteConfirmation.text')}</AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>
                      {t('Category.DeleteConfirmation.cancelButtonLabel')}
                    </AlertDialogCancel>
                    <AlertDialogAction onClick={handleDeleteCategory}>
                      {t('Category.DeleteConfirmation.confirmButtonLabel')}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </div>
        <div>
          {categoryIsEmpty ? (
            <p className="p-4">{t('Category.emptyCategoryText')}</p>
          ) : (
            <div className="mt-3">
              <BookmarkList bookmarks={category.bookmarks} />
            </div>
          )}
        </div>
      </div>
    </>
  );
}
