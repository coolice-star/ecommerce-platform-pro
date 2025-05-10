import { get, post, put } from '../api';

export async function createOrder(orderData: any) {
  return post('/orders', orderData, true);
}

export async function getOrders(params = {}) {
  const queryString = new URLSearchParams(params as Record<string, string>).toString();
  return get(`/orders?${queryString}`, true);
}

export async function getOrder(id: string) {
  return get(`/orders/${id}`, true);
}

export async function cancelOrder(id: string) {
  return put(`/orders/${id}/cancel`, {}, true);
}

// 管理员API
export async function getAdminOrders(params = {}) {
  const queryString = new URLSearchParams(params as Record<string, string>).toString();
  return get(`/orders/admin?${queryString}`, true);
}

export async function updateOrderStatus(id: string, status: string) {
  return put(`/orders/${id}/status`, { status }, true);
} 