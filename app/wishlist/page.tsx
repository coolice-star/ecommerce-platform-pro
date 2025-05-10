"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import ProductCard from "@/components/product-card"
import { useAuth } from "@/lib/hooks/use-auth"
import { featuredProducts } from "@/lib/data"

// 模拟收藏夹数据
const mockWishlist = [featuredProducts[0], featuredProducts[2], featuredProducts[5]]

export default function WishlistPage() {
  const router = useRouter()
  const { user } = useAuth()

  // 如果用户未登录，重定向到登录页面
  useEffect(() => {
    if (!user) {
      router.push("/login?redirect=/wishlist")
    }
  }, [user, router])

  if (!user) {
    return null // 等待重定向
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-6">我的收藏</h1>

      {mockWishlist.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {mockWishlist.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 border rounded-lg">
          <Heart className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h2 className="text-lg font-medium mb-2">收藏夹为空</h2>
          <p className="text-muted-foreground mb-6">您还没有收藏任何商品</p>
          <Button asChild>
            <Link href="/products">浏览商品</Link>
          </Button>
        </div>
      )}
    </div>
  )
}
