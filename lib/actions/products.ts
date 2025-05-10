import { get, post, put, del } from '../api';

export async function getProducts(params = {}) {
  const queryString = new URLSearchParams(params as Record<string, string>).toString();
  return get(`/products?${queryString}`);
}

export async function getProduct(id: string) {
  return get(`/products/${id}`);
}

export async function getProductComments(id: string, page = 1) {
  return get(`/products/${id}/comments?page=${page}`);
}

export async function addProductComment(id: string, rating: number, content: string) {
  return post(`/products/${id}/comments`, { rating, content }, true);
}

// 管理员API
export async function createProduct(productData: any) {
  return post('/products', productData, true);
}

export async function updateProduct(id: string, productData: any) {
  return put(`/products/${id}`, productData, true);
}

export async function deleteProduct(id: string) {
  return del(`/products/${id}`, true);
} 