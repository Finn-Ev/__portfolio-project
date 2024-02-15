import { fetchBackend } from '../fetchBackend';

export async function getAllCategories() {
  return await fetchBackend('GET', '/categories');
}
