import BookmarkList from '@/components/bookmark-list';
import ErrorMessage from '@/components/error-message';
import { getAllFavourites } from '@/lib/actions/bookmarks/favourites/get-all';
import PageHeader from '@/components/page-header';

export default async function BookmarksPage() {
  const { value: bookmarks, errorMessage, success } = await getAllFavourites();

  if (!success) {
    return <ErrorMessage message={errorMessage!} />;
  }

  return (
    <div>
      <PageHeader title="Your favourite bookmarks." />
      <BookmarkList
        emptyListText="You haven't marked any bookmarks as a favourite yet."
        bookmarks={bookmarks!}
      />
    </div>
  );
}
