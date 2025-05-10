/**
 * API基础URL，指向后端服务
 * 在生产环境中指向已部署的后端服务
 */
export const API_BASE_URL = 'http://47.238.143.12:7000/api';

/**
 * API请求选项接口
 */
interface ApiOptions {
  method?: string;        // HTTP请求方法: GET, POST, PUT, DELETE等
  body?: any;             // 请求体数据
  requireAuth?: boolean;  // 是否需要身份验证
}

/**
 * 通用API请求函数
 * 
 * 封装了与后端API通信的基础逻辑，包括添加必要的请求头、处理身份验证、
 * 解析响应数据以及错误处理。
 * 
 * @param endpoint - API端点路径，不包含基础URL部分
 * @param options - 请求选项，包括方法、请求体和是否需要身份验证
 * @returns 解析后的响应数据
 * @throws 请求失败时抛出错误
 */
export async function fetchAPI(endpoint: string, options: ApiOptions = {}) {
  const { method = 'GET', body, requireAuth = false } = options;
  
  // 设置请求头
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  
  // 添加认证Token
  if (requireAuth) {
    // 从localStorage中获取认证token
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    } else {
      // 如果需要认证但没有token，抛出错误
      throw new Error('需要认证，但未找到Token');
    }
  }
  
  try {
    // 发送HTTP请求
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });
    
    // 解析响应数据为JSON
    const data = await response.json();
    
    // 检查响应状态是否成功
    if (!response.ok) {
      // 创建一个错误对象，并添加原始响应数据
      const error = new Error(data.message || '请求失败');
      // @ts-ignore - 添加额外属性
      error.data = data;
      // @ts-ignore - 添加状态码
      error.status = response.status;
      throw error;
    }
    
    return data;
  } catch (error) {
    // 记录API请求错误
    console.error('API请求错误:', error);
    throw error;
  }
}

/**
 * 简化的GET请求函数
 * 
 * @param endpoint - API端点路径
 * @param requireAuth - 是否需要身份验证，默认为false
 * @returns 解析后的响应数据
 */
export function get(endpoint: string, requireAuth = false) {
  return fetchAPI(endpoint, { requireAuth });
}

/**
 * 简化的POST请求函数
 * 
 * @param endpoint - API端点路径
 * @param data - 请求体数据
 * @param requireAuth - 是否需要身份验证，默认为false
 * @returns 解析后的响应数据
 */
export function post(endpoint: string, data: any, requireAuth = false) {
  return fetchAPI(endpoint, {
    method: 'POST',
    body: data,
    requireAuth,
  });
}

/**
 * 简化的PUT请求函数
 * 
 * @param endpoint - API端点路径
 * @param data - 请求体数据
 * @param requireAuth - 是否需要身份验证，默认为false
 * @returns 解析后的响应数据
 */
export function put(endpoint: string, data: any, requireAuth = false) {
  return fetchAPI(endpoint, {
    method: 'PUT',
    body: data,
    requireAuth,
  });
}

/**
 * 简化的DELETE请求函数
 * 
 * @param endpoint - API端点路径
 * @param requireAuth - 是否需要身份验证，默认为false
 * @returns 解析后的响应数据
 */
export function del(endpoint: string, requireAuth = false) {
  return fetchAPI(endpoint, {
    method: 'DELETE',
    requireAuth,
  });
} 