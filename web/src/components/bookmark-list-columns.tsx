import { Bookmark } from '@/lib/types';
import useWindowResize from '@/lib/utils/use-window-resize';
import { SORT_DIRECTION, SORT_FIELD, useBookmarkListContext } from '@/providers';
import BookmarkListColumn from '@/components/bookmark-list-column';
import BookmarkListSortSelect from '@/components/bookmark-list-sort-select';

export default function BookmarkListColumns({ bookmarks }: { bookmarks: Bookmark[] }) {
  const { width } = useWindowResize();

  const { sortConfig } = useBookmarkListContext();

  if (!width) return null;

  // Sort the bookmarks by via updated_at or created_at and descending or ascending order
  const sortedBookmarks = bookmarks.sort((a, b) => {
    if (sortConfig.field === SORT_FIELD.UPDATED_AT) {
      if (sortConfig.direction === SORT_DIRECTION.ASC) {
        return new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
      }
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    }

    // sorting by created_at field
    if (sortConfig.direction === SORT_DIRECTION.ASC) {
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    }
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  // The expanded state of a bookmark should not affect the bookmarks in the same row-level;
  // To achieve this, the bookmarks need to be split into their own independent columns so that each bookmark has a row of its own which does not affect the other bookmarks
  // Otherwise, some resizing or repositioning or empty space would occur on the same row bookmarks
  return (
    <div>
      <BookmarkListSortSelect />
      {getBookmarksListColumns()}
    </div>
  );

  function getBookmarksListColumns() {
    if (width! < 640) {
      return (
        <div className="grid grid-cols-1 gap-3">
          <BookmarkListColumn bookmarks={sortedBookmarks} />
        </div>
      );
    }

    if (width! < 1024) {
      return (
        <div className="grid grid-cols-2 gap-3">
          <BookmarkListColumn bookmarks={sortedBookmarks.filter((_, idx) => idx % 2 === 0)} />
          <BookmarkListColumn bookmarks={sortedBookmarks.filter((_, idx) => idx % 2 !== 0)} />
        </div>
      );
    }

    if (width! < 1440) {
      return (
        <div className="grid grid-cols-3 gap-3">
          <BookmarkListColumn bookmarks={sortedBookmarks.filter((_, idx) => idx % 3 === 0)} />
          <BookmarkListColumn bookmarks={sortedBookmarks.filter((_, idx) => idx % 3 === 1)} />
          <BookmarkListColumn bookmarks={sortedBookmarks.filter((_, idx) => idx % 3 === 2)} />
        </div>
      );
    }

    return (
      <div className="grid grid-cols-4 gap-3">
        <BookmarkListColumn bookmarks={sortedBookmarks.filter((_, idx) => idx % 4 === 0)} />
        <BookmarkListColumn bookmarks={sortedBookmarks.filter((_, idx) => idx % 4 === 1)} />
        <BookmarkListColumn bookmarks={sortedBookmarks.filter((_, idx) => idx % 4 === 2)} />
        <BookmarkListColumn bookmarks={sortedBookmarks.filter((_, idx) => idx % 4 === 3)} />
      </div>
    );
  }
}
