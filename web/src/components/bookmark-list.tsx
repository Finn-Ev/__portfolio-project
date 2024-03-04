'use client';

import { useState } from 'react';
import { Bookmark } from '@/lib/types';
import useWindowResize from '@/lib/utils/use-window-resize';
import BookmarkListColumn from '@/components/bookmark-list-column';
import { BookmarkListProvider } from '../providers';
import BookmarkListColumns from './bookmark-list-columns';

interface BookmarkListProps {
  bookmarks: Bookmark[];
  emptyListText?: string;
}

export default function BookmarkList({ emptyListText, bookmarks }: BookmarkListProps) {
  if (!bookmarks.length) return <p>{emptyListText}</p>;

  return (
    <BookmarkListProvider>
      <BookmarkListColumns bookmarks={bookmarks} />
    </BookmarkListProvider>
  );
}
