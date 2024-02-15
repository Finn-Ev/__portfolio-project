export type Bookmark = {
  id: number;
  title: string;
  link: string;
  categoryId?: number;
  description?: string;
  isFavourite: boolean;

  createdAt: string;
  updatedAt: string;
};
