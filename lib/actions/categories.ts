import { get, post, put, del } from '../api';

export async function getCategories() {
  return get('/categories');
}

export async function getCategory(slug: string) {
  return get(`/categories/${slug}`);
}

// 管理员API
export async function createCategory(categoryData: any) {
  return post('/categories', categoryData, true);
}

export async function updateCategory(id: string, categoryData: any) {
  return put(`/categories/${id}`, categoryData, true);
}

export async function deleteCategory(id: string) {
  return del(`/categories/${id}`, true);
} 