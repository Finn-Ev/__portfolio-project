import { Category } from '../../types/category';
import { fetchBackend } from '../fetchBackend';

export async function getAllCategories() {
  return await fetchBackend<Category[]>('GET', '/categories');
}
