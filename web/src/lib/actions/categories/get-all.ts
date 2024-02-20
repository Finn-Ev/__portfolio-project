import { Category } from '../../types/category';
import { fetchBackend } from '../fetch-backend';

export async function getAllCategories() {
  return await fetchBackend<Category[]>('GET', '/categories');
}
