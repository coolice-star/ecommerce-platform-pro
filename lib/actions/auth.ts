import { post, get } from '../api';

export async function login(email: string, password: string) {
  return post('/auth/login', { email, password });
}

export async function register(name: string, email: string, password: string) {
  return post('/auth/register', { name, email, password });
}

export async function getUserProfile() {
  return get('/users/me', true);
} 