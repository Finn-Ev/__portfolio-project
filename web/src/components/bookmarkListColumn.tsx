'use client';

import { Bookmark } from '@/lib/types';
import BookmarkListItem from '@/components/bookmarkListItem';

interface BookmarkListProps {
  bookmarks: Bookmark[];
  expandedBookmarkId: number | null;
  setExpandedBookmarkId: (id: number | null) => void;
}

export default function BookmarkListColumn({
  bookmarks,
  expandedBookmarkId, // TODO: create a bookmarkList-context to prevent prop drilling
  setExpandedBookmarkId, // TODO: create a bookmarkList-context to prevent prop drilling
}: BookmarkListProps) {
  return (
    <ul className="flex flex-col gap-3 w-full">
      {bookmarks!.map((bookmark, idx) => {
        return (
          <BookmarkListItem
            key={bookmark.id}
            isExpanded={expandedBookmarkId === bookmark.id}
            setExpandedBookmarkId={setExpandedBookmarkId}
            {...bookmark}
          />
        );
      })}
    </ul>
  );
}
