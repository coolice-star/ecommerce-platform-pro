import { get, put } from '../api';

export async function updateProfile(userData: any) {
  return put('/users/me', userData, true);
}

export async function changePassword(currentPassword: string, newPassword: string) {
  return put('/users/me/password', { currentPassword, newPassword }, true);
}

// 管理员API
export async function getUsers() {
  return get('/users', true);
}

export async function getUser(id: string) {
  return get(`/users/${id}`, true);
}

export async function toggleAdmin(id: string) {
  return put(`/users/${id}/admin`, {}, true);
} 