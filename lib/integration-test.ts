// 前后端集成测试文件
// 这个文件只是提供测试示例，不需要在生产环境中使用

import {
  login,
  register,
  getUserProfile
} from './actions/auth';

import {
  getProducts,
  getProduct,
  getProductComments,
  addProductComment
} from './actions/products';

import {
  getCategories,
  getCategory
} from './actions/categories';

import {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart
} from './actions/cart';

import {
  createOrder,
  getOrders,
  getOrder
} from './actions/orders';

// 测试认证API
async function testAuthAPI() {
  console.log('测试认证API...');
  try {
    // 1. 注册新用户
    console.log('测试注册...');
    const registerResult = await register('测试用户', 'test@example.com', 'password123');
    console.log('注册结果:', registerResult);

    // 2. 登录
    console.log('测试登录...');
    const loginResult = await login('test@example.com', 'password123');
    console.log('登录结果:', loginResult);

    // 3. 获取用户信息
    console.log('测试获取用户信息...');
    const userProfile = await getUserProfile();
    console.log('用户信息:', userProfile);

    return true;
  } catch (error) {
    console.error('认证API测试失败:', error);
    return false;
  }
}

// 测试商品API
async function testProductsAPI() {
  console.log('测试商品API...');
  try {
    // 1. 获取所有商品
    console.log('测试获取所有商品...');
    const products = await getProducts();
    console.log(`获取到 ${products.length} 个商品`);

    if (products.length > 0) {
      const productId = products[0].id;
      
      // 2. 获取单个商品详情
      console.log(`测试获取商品详情 (ID: ${productId})...`);
      const product = await getProduct(productId);
      console.log('商品详情:', product);

      // 3. 获取商品评论
      console.log(`测试获取商品评论 (ID: ${productId})...`);
      const comments = await getProductComments(productId);
      console.log(`获取到 ${comments.length} 条评论`);

      // 4. 添加商品评论 (需要登录)
      console.log(`测试添加商品评论 (ID: ${productId})...`);
      try {
        const commentResult = await addProductComment(productId, 5, '这是一个测试评论');
        console.log('添加评论结果:', commentResult);
      } catch (error) {
        console.log('添加评论需要登录，跳过测试');
      }
    }

    return true;
  } catch (error) {
    console.error('商品API测试失败:', error);
    return false;
  }
}

// 测试分类API
async function testCategoriesAPI() {
  console.log('测试分类API...');
  try {
    // 1. 获取所有分类
    console.log('测试获取所有分类...');
    const categories = await getCategories();
    console.log(`获取到 ${categories.length} 个分类`);

    if (categories.length > 0) {
      const categorySlug = categories[0].slug;
      
      // 2. 获取分类详情
      console.log(`测试获取分类详情 (Slug: ${categorySlug})...`);
      const category = await getCategory(categorySlug);
      console.log('分类详情:', category);
    }

    return true;
  } catch (error) {
    console.error('分类API测试失败:', error);
    return false;
  }
}

// 测试购物车API (需要登录)
async function testCartAPI() {
  console.log('测试购物车API (需要登录)...');
  try {
    // 1. 获取购物车
    console.log('测试获取购物车...');
    const cart = await getCart();
    console.log('购物车:', cart);

    // 测试前先获取一个商品ID
    const products = await getProducts();
    if (products.length > 0) {
      const productId = products[0].id;

      // 2. 添加商品到购物车
      console.log(`测试添加商品到购物车 (ID: ${productId})...`);
      const addResult = await addToCart(productId, 1);
      console.log('添加结果:', addResult);

      // 3. 更新购物车商品数量
      console.log(`测试更新购物车商品数量 (ID: ${productId})...`);
      const updateResult = await updateCartItem(productId, 2);
      console.log('更新结果:', updateResult);

      // 4. 从购物车移除商品
      console.log(`测试从购物车移除商品 (ID: ${productId})...`);
      const removeResult = await removeFromCart(productId);
      console.log('移除结果:', removeResult);
    }

    // 5. 清空购物车
    console.log('测试清空购物车...');
    const clearResult = await clearCart();
    console.log('清空结果:', clearResult);

    return true;
  } catch (error) {
    console.error('购物车API测试失败:', error);
    return false;
  }
}

// 测试订单API (需要登录)
async function testOrdersAPI() {
  console.log('测试订单API (需要登录)...');
  try {
    // 1. 创建订单
    console.log('测试创建订单...');
    const orderData = {
      address: '测试地址',
      city: '测试城市',
      postalCode: '100000',
      country: '中国',
      paymentMethod: 'wechat'
    };
    
    const createResult = await createOrder(orderData);
    console.log('创建订单结果:', createResult);

    // 2. 获取所有订单
    console.log('测试获取所有订单...');
    const orders = await getOrders();
    console.log(`获取到 ${orders.length} 个订单`);

    if (orders.length > 0) {
      const orderId = orders[0].id;
      
      // 3. 获取订单详情
      console.log(`测试获取订单详情 (ID: ${orderId})...`);
      const order = await getOrder(orderId);
      console.log('订单详情:', order);
    }

    return true;
  } catch (error) {
    console.error('订单API测试失败:', error);
    return false;
  }
}

// 运行所有测试
export async function runIntegrationTests() {
  console.log('开始前后端集成测试...');
  
  // 测试无需登录的API
  await testProductsAPI();
  await testCategoriesAPI();
  
  // 测试需要登录的API (首先登录)
  const authSuccess = await testAuthAPI();
  if (authSuccess) {
    await testCartAPI();
    await testOrdersAPI();
  }
  
  console.log('集成测试完成');
}

// 只有在直接运行此文件时才执行测试
if (typeof window !== 'undefined' && window.location.pathname.includes('integration-test')) {
  runIntegrationTests();
} 