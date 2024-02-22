import { Trash2 } from 'lucide-react';
import { Category } from '../lib/types/category';
import BookmarkList from './bookmark-list';
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
} from './ui/alert-dialog';
import { deleteCategory } from '../lib/actions/categories/delete';
import { useToast } from './ui/toast/use-toast';
import { useRouter } from 'next/navigation';

const ROOT_CATEGORY_TITLE = '__ROOT__';

interface CategoryListItemProps {
  category: Category;
}

export default function CategoryListItem({ category }: CategoryListItemProps) {
  const { toast } = useToast();
  const router = useRouter();

  const isRootCategory = category.title === ROOT_CATEGORY_TITLE;
  const categoryIsEmpty = category.bookmarks.length === 0;

  const handleDeleteCategory = async () => {
    const { success, errorMessage } = await deleteCategory(category.id);

    if (success) {
      toast({
        title: 'Category deleted',
        description: 'The category has been deleted.',
      });
    } else {
      toast({
        title: 'Error',
        description: errorMessage ?? 'Something went wrong. Please try again.',
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
            <h2 className="mb-2">Uncategorised bookmarks:</h2>
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
      <div className="mt-3">
        <div className="bg-background rounded-lg p-4">
          <div className="flex justify-between">
            <div>
              <h2>{category.title}</h2>
              {category.description && <p className="mt-3 mb-2">{category.description}</p>}
            </div>
            <div>
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
                        This action cannot be undone. This will permanently delete the category. <br />
                        The bookmarks in this category wont be deleted.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={handleDeleteCategory}>Delete category</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          </div>
        </div>
        <div>
          {categoryIsEmpty && <p className="p-4">This category is empty</p>}
          <BookmarkList bookmarks={category.bookmarks} />
        </div>
      </div>
    </>
  );
}