'use client';

import { useState } from 'react';
import { Bookmark } from '../lib/types';
import useWindowResize from '../lib/utils/useWindowResize';
import BookmarkListColumn from './bookmarkListColumn';

interface BookmarkListProps {
  bookmarks: Bookmark[];
  emptyListText?: string;
}

export default function BookmarkList({ emptyListText, bookmarks }: BookmarkListProps) {
  const [expandedBookmarkId, setExpandedBookmarkId] = useState<number | null>(null);
  const { width } = useWindowResize();

  if (!bookmarks.length) return <p>{emptyListText}</p>;

  // The expanded state of a bookmark should not affect the bookmarks in the same row-level;
  // To achieve this, the bookmarks need to be split into their own independent columns so that each bookmark has a row of its own which does not affect the other bookmarks
  // Otherwise, some resizing or repositioning or empty space would occur on the same row bookmarks
  if (width < 640) {
    return (
      <div className="grid grid-cols-1 gap-3">
        <BookmarkListColumn
          bookmarks={bookmarks}
          expandedBookmarkId={expandedBookmarkId}
          setExpandedBookmarkId={setExpandedBookmarkId}
        />
      </div>
    );
  }

  if (width < 1024) {
    return (
      <div className="grid grid-cols-2 gap-3">
        <BookmarkListColumn
          bookmarks={bookmarks.filter((_, idx) => idx % 2 === 0)}
          expandedBookmarkId={expandedBookmarkId}
          setExpandedBookmarkId={setExpandedBookmarkId}
        />
        <BookmarkListColumn
          bookmarks={bookmarks.filter((_, idx) => idx % 2 !== 0)}
          expandedBookmarkId={expandedBookmarkId}
          setExpandedBookmarkId={setExpandedBookmarkId}
        />
      </div>
    );
  }

  if (width < 1440) {
    return (
      <div className="grid grid-cols-3 gap-3">
        <BookmarkListColumn
          bookmarks={bookmarks.filter((_, idx) => idx % 3 === 0)}
          expandedBookmarkId={expandedBookmarkId}
          setExpandedBookmarkId={setExpandedBookmarkId}
        />
        <BookmarkListColumn
          bookmarks={bookmarks.filter((_, idx) => idx % 3 === 1)}
          expandedBookmarkId={expandedBookmarkId}
          setExpandedBookmarkId={setExpandedBookmarkId}
        />
        <BookmarkListColumn
          bookmarks={bookmarks.filter((_, idx) => idx % 3 === 2)}
          expandedBookmarkId={expandedBookmarkId}
          setExpandedBookmarkId={setExpandedBookmarkId}
        />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-4 gap-3">
      <BookmarkListColumn
        bookmarks={bookmarks.filter((_, idx) => idx % 4 === 0)}
        expandedBookmarkId={expandedBookmarkId}
        setExpandedBookmarkId={setExpandedBookmarkId}
      />
      <BookmarkListColumn
        bookmarks={bookmarks.filter((_, idx) => idx % 4 === 1)}
        expandedBookmarkId={expandedBookmarkId}
        setExpandedBookmarkId={setExpandedBookmarkId}
      />
      <BookmarkListColumn
        bookmarks={bookmarks.filter((_, idx) => idx % 4 === 2)}
        expandedBookmarkId={expandedBookmarkId}
        setExpandedBookmarkId={setExpandedBookmarkId}
      />
      <BookmarkListColumn
        bookmarks={bookmarks.filter((_, idx) => idx % 4 === 3)}
        expandedBookmarkId={expandedBookmarkId}
        setExpandedBookmarkId={setExpandedBookmarkId}
      />
    </div>
  );
}
