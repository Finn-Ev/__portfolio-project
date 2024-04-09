import BookmarkFormDialog from '@/components/bookmark-form-dialog';
import BookmarkList from '@/components/bookmark-list';
import ErrorMessage from '@/components/error-message';
import { getAllBookmarks } from '@/lib/actions/bookmarks/get-all';
import PageHeader from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { getTranslations } from 'next-intl/server';

export default async function BookmarksPage() {
  const t = await getTranslations();

  const { value: bookmarks, errorMessage, success } = await getAllBookmarks();

  if (!success) {
    return <ErrorMessage message={errorMessage!} />;
  }

  return (
    <div>
      <PageHeader
        title={t('Bookmark.pageTitle')}
        actionButton={
          <BookmarkFormDialog
            defaultValues={{ link: '', title: '', description: '' }}
            triggerElement={
              <Button variant="outline">
                {t('Bookmark.createButtonLabel')} <PlusCircle className="ml-2" />
              </Button>
            }
          />
        }
      />
      <BookmarkList emptyListText={t('Bookmark.emptyListText')} bookmarks={bookmarks!} />
    </div>
  );
}
