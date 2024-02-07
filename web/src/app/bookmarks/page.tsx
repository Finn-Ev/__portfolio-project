import BookmarkForm from '../../components/bookmarkForm';
import ErrorMessage from '../../components/errorMessage';
import { getAllBookmarks } from '../../lib/actions/bookmarks/getAll';

export default async function BookmarksPage() {
  const { value: bookmarks, error } = await getAllBookmarks();

  if (error) {
    return <ErrorMessage message={error.message} />;
  }

  return (
    <div className="flex justify-between w-full">
      <h1>Here are all your bookmarks</h1>
      <BookmarkForm />

      {bookmarks!.length === 0 ? (
        <div>Create your first bookmark.</div>
      ) : (
        <ul>
          {bookmarks!.map((bookmark) => (
            <li key={bookmark!.id}>{bookmark.title}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
