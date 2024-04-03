import { Check, SortAscIcon, SortDescIcon } from 'lucide-react';
import { SORT_DIRECTION, SORT_FIELD, useBookmarkListContext } from '../providers';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export default function BookmarkListSortSelect() {
  const { sortConfig, changeSortConfig } = useBookmarkListContext();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="absolute right-4 bottom-4 bg-background p-2 rounded-full shadow-xl">
        {sortConfig.direction === SORT_DIRECTION.ASC ? <SortAscIcon /> : <SortDescIcon />}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="mb-2">
        <DropdownMenuLabel>Sort by</DropdownMenuLabel>
        <DropdownMenuItem onClick={() => changeSortConfig({ ...sortConfig, field: SORT_FIELD.UPDATED_AT })}>
          Updated at {sortConfig.field === SORT_FIELD.UPDATED_AT && <Check className="ml-1" />}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => changeSortConfig({ ...sortConfig, field: SORT_FIELD.CREATED_AT })}>
          Created at {sortConfig.field === SORT_FIELD.CREATED_AT && <Check className="ml-1" />}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuLabel>Sort order</DropdownMenuLabel>
        <DropdownMenuItem onClick={() => changeSortConfig({ ...sortConfig, direction: SORT_DIRECTION.DESC })}>
          Newest first {sortConfig.direction === SORT_DIRECTION.DESC && <Check className="ml-1" />}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => changeSortConfig({ ...sortConfig, direction: SORT_DIRECTION.ASC })}>
          Oldest first {sortConfig.direction === SORT_DIRECTION.ASC && <Check className="ml-1" />}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
