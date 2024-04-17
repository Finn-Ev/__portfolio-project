import { Check, SortAscIcon, SortDescIcon } from 'lucide-react';
import { SORT_DIRECTION, SORT_FIELD, useBookmarkListContext } from '@/providers';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useTranslations } from 'next-intl';

export default function BookmarkListSortSelect() {
  const t = useTranslations();
  const { sortConfig, changeSortConfig } = useBookmarkListContext();

  return (
    <div id="bookmark-sort-select">
      <DropdownMenu>
        <DropdownMenuTrigger className="absolute right-1 md:right-4 top-1 md:bottom-4 bg-background p-2 rounded-full shadow-xl">
          {sortConfig.direction === SORT_DIRECTION.ASC ? <SortAscIcon /> : <SortDescIcon />}
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="mb-2">
          <DropdownMenuLabel>{t('SortDropdown.sortByLabel')}</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => changeSortConfig({ ...sortConfig, field: SORT_FIELD.UPDATED_AT })}>
            {t('SortDropdown.updatedAtLabel')}
            {sortConfig.field === SORT_FIELD.UPDATED_AT && <Check className="ml-1" />}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => changeSortConfig({ ...sortConfig, field: SORT_FIELD.CREATED_AT })}>
            {t('SortDropdown.createdAtLabel')}
            {sortConfig.field === SORT_FIELD.CREATED_AT && <Check className="ml-1" />}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuLabel>{t('SortDropdown.sortByLabel')}</DropdownMenuLabel>
          <DropdownMenuItem
            onClick={() => changeSortConfig({ ...sortConfig, direction: SORT_DIRECTION.DESC })}
          >
            {t('SortDropdown.descendingLabel')}
            {sortConfig.direction === SORT_DIRECTION.DESC && <Check className="ml-1" />}
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => changeSortConfig({ ...sortConfig, direction: SORT_DIRECTION.ASC })}
          >
            {t('SortDropdown.ascendingLabel')}
            {sortConfig.direction === SORT_DIRECTION.ASC && <Check className="ml-1" />}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
