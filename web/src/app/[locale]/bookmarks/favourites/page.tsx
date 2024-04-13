import BookmarkList from '@/components/bookmark-list';
import ErrorMessage from '@/components/error-message';
import { getAllFavourites } from '@/lib/actions/bookmarks/favourites/get-all';
import PageHeader from '@/components/page-header';
import { getTranslations } from 'next-intl/server';
import { Metadata } from 'next';

export default async function BookmarksPage() {
  const t = await getTranslations();

  const { value: bookmarks, errorMessage, success } = await getAllFavourites();

  if (!success) {
    return <ErrorMessage message={errorMessage!} />;
  }

  return (
    <div>
      <PageHeader title={t('Favourite.pageTitle')} />
      <BookmarkList emptyListText={t('Favourite.emptyListText')} bookmarks={bookmarks!} />
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
    title: t('Miscellaneous.pageTabTitles.favourites'),
  };
}
