export type Bookmark = {
  id: number;
  title: string;
  link: string;
  categoryId?: number;
  description?: string;
  isFavorite: boolean;

  createdAt: string;
  updatedAt: string;
};
