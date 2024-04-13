import { createContext, useContext, useEffect, useState } from 'react';

const LOCAL_STORAGE_SORT_CONFIG_KEY = 'bookmark-list-sort-config';

export enum SORT_FIELD {
  CREATED_AT = 'created_at',
  UPDATED_AT = 'updated_at',
}

export enum SORT_DIRECTION {
  ASC = 'asc',
  DESC = 'desc',
}

interface BookmarkListContext {
  expandedBookmarkId: number | null;
  setExpandedBookmarkId: React.Dispatch<React.SetStateAction<number | null>>;
  sortConfig: {
    field: SORT_FIELD;
    direction: SORT_DIRECTION;
  };
  changeSortConfig: (newSortConfig: { field: SORT_FIELD; direction: SORT_DIRECTION }) => void;
}

const BookmarkListContext = createContext<BookmarkListContext | null>(null);

export const useBookmarkListContext = () => {
  const context = useContext(BookmarkListContext);
  if (!context) {
    throw new Error('useBookmarkList must be used within a BookmarkListProvider');
  }
  return context;
};

export const BookmarkListProvider = ({ children }: { children: React.ReactNode }) => {
  const [expandedBookmarkId, setExpandedBookmarkId] = useState<number | null>(null);
  const [sortConfig, setSortConfig] = useState({
    field: SORT_FIELD.CREATED_AT,
    direction: SORT_DIRECTION.DESC,
  });

  useEffect(() => {
    const savedSortConfig = localStorage.getItem(LOCAL_STORAGE_SORT_CONFIG_KEY);
    if (savedSortConfig) {
      setSortConfig(JSON.parse(savedSortConfig));
    }
  }, []);

  function changeSortConfig(newSortConfig: { field: SORT_FIELD; direction: SORT_DIRECTION }) {
    setSortConfig(newSortConfig);
    localStorage.setItem(LOCAL_STORAGE_SORT_CONFIG_KEY, JSON.stringify(newSortConfig));
  }

  return (
    <BookmarkListContext.Provider
      value={{ expandedBookmarkId, setExpandedBookmarkId, sortConfig, changeSortConfig }}
    >
      {children}
    </BookmarkListContext.Provider>
  );
};
