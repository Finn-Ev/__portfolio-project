import { Category } from '@/lib/types/category';
import { fetchBackend } from '@/lib/actions/fetch-backend';

export async function getAllCategories() {
  return await fetchBackend<Category[]>('GET', '/categories');
}
