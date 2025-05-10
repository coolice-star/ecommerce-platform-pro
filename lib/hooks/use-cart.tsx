"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect } from "react"
import type { Product, CartItem } from "@/lib/types"
import { useAuth } from "./use-auth"
import { 
  getCart as getCartApi, 
  addToCart as addToCartApi, 
  updateCartItem as updateCartItemApi, 
  removeFromCart as removeFromCartApi, 
  clearCart as clearCartApi 
} from "@/lib/actions/cart"

interface CartContextType {
  cartItems: CartItem[]
  addToCart: (product: Product, quantity?: number) => void
  removeFromCart: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  totalItems: number
  totalPrice: number
  isLoading: boolean
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const { user } = useAuth()

  // 从API加载购物车数据（已登录用户）或本地存储（未登录用户）
  useEffect(() => {
    if (user) {
      // 已登录用户从API获取购物车
      setIsLoading(true)
      getCartApi()
        .then(data => {
          setCartItems(data.items || [])
          setIsLoading(false)
        })
        .catch(error => {
          console.error("Failed to fetch cart:", error)
          setIsLoading(false)
        })
    } else {
      // 未登录用户从本地存储获取
      const storedCart = localStorage.getItem("cart")
      if (storedCart) {
        try {
          setCartItems(JSON.parse(storedCart))
        } catch (error) {
          console.error("Failed to parse cart data:", error)
          setCartItems([])
        }
      }
    }
  }, [user])

  // 为未登录用户保存购物车到本地存储
  useEffect(() => {
    if (!user && cartItems.length > 0) {
      localStorage.setItem("cart", JSON.stringify(cartItems))
    }
  }, [cartItems, user])

  const addToCart = async (product: Product, quantity = 1) => {
    if (user) {
      // 已登录用户调用API
      try {
        setIsLoading(true)
        await addToCartApi(product.id, quantity)
        // 重新获取购物车
        const cartData = await getCartApi()
        setCartItems(cartData.items || [])
        setIsLoading(false)
      } catch (error) {
        console.error("Failed to add to cart:", error)
        setIsLoading(false)
      }
    } else {
      // 未登录用户使用本地存储
      setCartItems((prev) => {
        const existingItem = prev.find((item) => item.product.id === product.id)

        if (existingItem) {
          return prev.map((item) =>
            item.product.id === product.id ? { ...item, quantity: item.quantity + quantity } : item,
          )
        } else {
          return [...prev, { product, quantity }]
        }
      })
    }
  }

  const removeFromCart = async (productId: string) => {
    if (user) {
      // 已登录用户调用API
      try {
        setIsLoading(true)
        await removeFromCartApi(productId)
        // 重新获取购物车
        const cartData = await getCartApi()
        setCartItems(cartData.items || [])
        setIsLoading(false)
      } catch (error) {
        console.error("Failed to remove from cart:", error)
        setIsLoading(false)
      }
    } else {
      // 未登录用户使用本地存储
      setCartItems((prev) => prev.filter((item) => item.product.id !== productId))

      // 如果购物车为空，清除本地存储
      if (cartItems.length === 1) {
        localStorage.removeItem("cart")
      }
    }
  }

  const updateQuantity = async (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId)
      return
    }

    if (user) {
      // 已登录用户调用API
      try {
        setIsLoading(true)
        await updateCartItemApi(productId, quantity)
        // 重新获取购物车
        const cartData = await getCartApi()
        setCartItems(cartData.items || [])
        setIsLoading(false)
      } catch (error) {
        console.error("Failed to update cart item:", error)
        setIsLoading(false)
      }
    } else {
      // 未登录用户使用本地存储
      setCartItems((prev) => prev.map((item) => (item.product.id === productId ? { ...item, quantity } : item)))
    }
  }

  const clearCart = async () => {
    if (user) {
      // 已登录用户调用API
      try {
        setIsLoading(true)
        await clearCartApi()
        setCartItems([])
        setIsLoading(false)
      } catch (error) {
        console.error("Failed to clear cart:", error)
        setIsLoading(false)
      }
    } else {
      // 未登录用户使用本地存储
      setCartItems([])
      localStorage.removeItem("cart")
    }
  }

  const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0)

  const totalPrice = cartItems.reduce((total, item) => total + item.product.price * item.quantity, 0)

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
        isLoading
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
