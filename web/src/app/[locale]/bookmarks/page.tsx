import BookmarkFormDialog from '@/components/bookmark-form-dialog';
import BookmarkList from '@/components/bookmark-list';
import ErrorMessage from '@/components/error-message';
import { getAllBookmarks } from '@/lib/actions/bookmarks/get-all';
import PageHeader from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import { Metadata } from 'next';

export default async function BookmarksPage() {
  const t = await getTranslations();

  const { value: bookmarks, errorMessage, success } = await getAllBookmarks();

  if (!success) {
    return <ErrorMessage message={errorMessage!} />;
  }

  return (
    <div className="bookmarks-page">
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

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const t = await getTranslations({ locale });

  return {
    title: t('Miscellaneous.pageTabTitles.bookmarks'),
  };
}
