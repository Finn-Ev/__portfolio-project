'use client';

import { Bookmark } from '@/lib/types';
import BookmarkListItem from '@/components/bookmark-list-item';

interface BookmarkListProps {
  bookmarks: Bookmark[];
}

export default function BookmarkListColumn({ bookmarks }: BookmarkListProps) {
  return (
    <ul className="flex flex-col gap-3">
      {bookmarks!.map((bookmark) => {
        return <BookmarkListItem key={bookmark.id} {...bookmark} />;
      })}
    </ul>
  );
}
