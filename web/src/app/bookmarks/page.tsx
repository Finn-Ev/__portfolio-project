import BookmarkFormDialog from '@/components/bookmark-form';
import BookmarkList from '@/components/bookmark-list';
import ErrorMessage from '@/components/error-message';
import { getAllBookmarks } from '@/lib/actions/bookmarks/get-all';
import PageHeader from '../../components/page-header';
import { Button } from '../../components/ui/button';
import { PlusCircle } from 'lucide-react';

export default async function BookmarksPage() {
  const { value: bookmarks, errorMessage, success } = await getAllBookmarks();

  if (!success) {
    return <ErrorMessage message={errorMessage!} />;
  }

  return (
    <div>
      <PageHeader
        title="All bookmarks."
        actionButton={
          <BookmarkFormDialog
            triggerElement={
              <Button variant="outline">
                Create Bookmark <PlusCircle className="ml-2" />
              </Button>
            }
          />
        }
      />
      <BookmarkList emptyListText="Create your first bookmark." bookmarks={bookmarks!} />
    </div>
  );
}
