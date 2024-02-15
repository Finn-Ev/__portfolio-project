import BookmarkList from '@/components/bookmarkList';
import ErrorMessage from '@/components/errorMessage';
import { getAllFavourites } from '../../../lib/actions/bookmarks/favourites/getAll';
import PageHeader from '../../../components/page-header';

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
