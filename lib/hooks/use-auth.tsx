"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect } from "react"
import type { User } from "@/lib/types"
import { login as loginApi, register as registerApi, getUserProfile } from '@/lib/actions/auth'

interface AuthContextType {
  user: User | null
  isAdmin: boolean
  login: (email: string, password: string, asAdmin?: boolean) => Promise<boolean>
  register: (name: string, email: string, password: string) => Promise<boolean>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)

  // 从本地存储加载用户数据
  useEffect(() => {
    const token = localStorage.getItem("token")
    if (token) {
      // 如果有token，获取用户资料
      getUserProfile()
        .then(userData => {
          setUser(userData)
        })
        .catch(error => {
          console.error("Failed to fetch user profile:", error)
          localStorage.removeItem("token")
          setUser(null)
        })
    }
  }, [])

  const login = async (email: string, password: string, asAdmin = false): Promise<boolean> => {
    try {
      // 调用真实API
      const response = await loginApi(email, password)
      
      // 检查登录成功并获得token
      if (response.token) {
        localStorage.setItem("token", response.token)
        
        // 设置用户信息
        setUser(response.user || null)
        
        // 如果请求以管理员身份登录，但用户不是管理员，则拒绝登录
        if (asAdmin && response.user && !response.user.isAdmin) {
          localStorage.removeItem("token")
          return false
        }
        
        return true
      }
      return false
    } catch (error: any) {
      console.error("Login failed:", error)
      // 显示更详细的错误信息
      if (error.data && error.data.message) {
        console.error("Server message:", error.data.message)
      }
      return false
    }
  }

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    try {
      // 调用真实API
      const response = await registerApi(name, email, password)
      
      // 检查注册成功并获得token
      if (response.token) {
        localStorage.setItem("token", response.token)
        
        // 直接使用响应中的用户信息
        setUser(response.user || null)
        return true
      }
      return false
    } catch (error: any) {
      console.error("Registration failed:", error)
      // 显示更详细的错误信息
      if (error.data && error.data.message) {
        console.error("Server message:", error.data.message)
      }
      return false
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("token")
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAdmin: user?.isAdmin || false,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
