import { Bookmark } from '../lib/types';
import BookmarkListItem from './bookmarkListItem';

interface BookmarkListProps {
  bookmarks: Bookmark[];
  emptyListText?: string;
}

export default function BookmarkList({ emptyListText, bookmarks }: BookmarkListProps) {
  return (
    <div>
      {bookmarks!.length === 0 ? (
        emptyListText && <p>{emptyListText}</p>
      ) : (
        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {bookmarks!.map((bookmark) => (
            <BookmarkListItem key={bookmark.id} bookmark={bookmark} />
          ))}
        </ul>
      )}
    </div>
  );
}
