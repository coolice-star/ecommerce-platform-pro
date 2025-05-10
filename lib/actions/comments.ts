import { get, post } from '../api';

export interface CommentData {
  rating: number;
  content: string;
}

export async function getProductComments(productId: string, params = {}) {
  const queryString = new URLSearchParams(params as Record<string, string>).toString();
  return get(`/products/${productId}/comments?${queryString}`);
}

export async function addProductComment(productId: string, data: CommentData) {
  return post(`/products/${productId}/comments`, data, true);
} 