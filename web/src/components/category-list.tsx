'use client';

import { Category } from '@/lib/types/category';
import CategoryListItem from '@/components/category-list-item';

interface CategoryListProps {
  categories: Category[];
  emptyListText?: string;
}

export default function CategoryList({ emptyListText, categories }: CategoryListProps) {
  if (categories.length === 1) return <p>{emptyListText}</p>; // If there is only one category (the root-category), it means the user has not created any custom categories yet

  return (
    <div className="grid grid-cols-1 gap-3">
      {categories.map((category) => (
        <CategoryListItem category={category} key={category.id} />
      ))}
    </div>
  );
}
