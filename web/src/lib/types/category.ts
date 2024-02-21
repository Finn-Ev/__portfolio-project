import { Bookmark } from './bookmark';

export type Category = {
  id: number;
  title: string;
  description?: string;
  userId: number;
  bookmarks: Bookmark[];

  createdAt: string;
  updatedAt: string;
};
