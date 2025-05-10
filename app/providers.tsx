"use client"

import type React from "react"

import { CartProvider } from "@/lib/hooks/use-cart"
import { AuthProvider } from "@/lib/hooks/use-auth"
import { Toaster } from "@/components/ui/toaster"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <CartProvider>
        {children}
        <Toaster />
      </CartProvider>
    </AuthProvider>
  )
}
