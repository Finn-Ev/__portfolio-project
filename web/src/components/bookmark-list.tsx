'use client';

import { Bookmark } from '@/lib/types';
import { BookmarkListProvider } from '@/providers';
import BookmarkListColumns from '@/components/bookmark-list-columns';
import BookmarkListSortSelect from '@/components/bookmark-list-sort-select';

interface BookmarkListProps {
  bookmarks: Bookmark[];
  emptyListText?: string;
}

export default function BookmarkList({ emptyListText, bookmarks }: BookmarkListProps) {
  if (!bookmarks.length) return <p className="text-center">{emptyListText}</p>;

  return (
    <BookmarkListProvider>
      <BookmarkListColumns bookmarks={bookmarks} />
      <BookmarkListSortSelect />
    </BookmarkListProvider>
  );
}
