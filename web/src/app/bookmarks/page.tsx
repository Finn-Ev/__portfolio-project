import BookmarkForm from '../../components/bookmarkForm';
import BookmarkList from '../../components/bookmarkList';
import BookmarkListItem from '../../components/bookmarkListItem';
import ErrorMessage from '../../components/errorMessage';
import { getAllBookmarks } from '../../lib/actions/bookmarks/getAll';

export default async function BookmarksPage() {
  const { value: bookmarks, error } = await getAllBookmarks();

  if (error) {
    return <ErrorMessage message={error.message} />;
  }

  return (
    <div>
      <div className="flex justify-between items-center w-full mb-4">
        <h1 className="font-semibold text-lg">All bookmarks.</h1>
        <BookmarkForm />
      </div>

      <BookmarkList emptyListText="Create your first bookmark." bookmarks={bookmarks!} />
    </div>
  );
}
