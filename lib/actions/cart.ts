import { get, post, put, del } from '../api';

export async function getCart() {
  return get('/cart', true);
}

export async function addToCart(productId: string, quantity: number = 1) {
  return post('/cart/items', { productId, quantity }, true);
}

export async function updateCartItem(productId: string, quantity: number) {
  return put(`/cart/items/${productId}`, { quantity }, true);
}

export async function removeFromCart(productId: string) {
  return del(`/cart/items/${productId}`, true);
}

export async function clearCart() {
  return del('/cart/clear', true);
} 