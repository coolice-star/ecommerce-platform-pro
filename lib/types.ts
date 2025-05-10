import type React from "react"
export interface Product {
  id: string
  name: string
  description: string
  price: number
  image: string
  category: string
  stock: number
  rating: number
  reviewCount: number
  discount: number
  isNew: boolean
  createdAt: string
  features?: string[]
  specifications?: Record<string, string>
}

export interface Category {
  id: string
  name: string
  slug: string
  icon: React.ReactNode
}

export interface User {
  id: string
  name: string
  email: string
  isAdmin: boolean
  createdAt: string
}

export interface CartItem {
  product: Product
  quantity: number
}

export interface Comment {
  id: string
  userId: string
  userName: string
  productId: string
  rating: number
  content: string
  createdAt: string
}

export interface Order {
  id: string
  userId: string
  user?: User
  items: CartItem[]
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled"
  totalAmount: number
  createdAt: string
  shippingAddress: string
  paymentMethod: string
}
