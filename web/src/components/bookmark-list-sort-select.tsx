import { SortAscIcon, SortDescIcon } from 'lucide-react';
import { SORT_DIRECTION, useBookmarkListContext } from '../providers';

export default function BookmarkListSortSelect() {
  const { sortConfig, changeSortConfig } = useBookmarkListContext();

  // TODO use a dropdown to select both the sort direction and the sort field
  function handleSortConfigChangeRequest() {
    // ...
  }

  return (
    <button
      className="fixed right-4 bottom-4 cursor-pointer bg-background p-2 rounded-full shadow-xl"
      onClick={() =>
        changeSortConfig({
          direction: sortConfig.direction === SORT_DIRECTION.ASC ? SORT_DIRECTION.DESC : SORT_DIRECTION.ASC,
          field: sortConfig.field,
        })
      }
    >
      {sortConfig.direction === SORT_DIRECTION.ASC ? <SortAscIcon /> : <SortDescIcon />}
    </button>
  );
}
