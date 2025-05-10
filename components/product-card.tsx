"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Heart, ShoppingCart, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { useCart } from "@/lib/hooks/use-cart"
import type { Product } from "@/lib/types"

interface ProductCardProps {
  product: Product
  className?: string
}

export default function ProductCard({ product, className }: ProductCardProps) {
  const [isWishlisted, setIsWishlisted] = useState(false)
  const { addToCart } = useCart()

  const toggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault()
    setIsWishlisted(!isWishlisted)
  }

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    addToCart(product)
  }

  return (
    <Card className={cn("group overflow-hidden", className)}>
      <Link href={`/products/${product.id}`}>
        <div className="relative aspect-square overflow-hidden">
          <Image
            src={product.image || "/placeholder.svg"}
            alt={product.name}
            fill
            className="object-cover transition-transform group-hover:scale-105"
          />
          {product.discount > 0 && (
            <Badge className="absolute top-2 left-2 bg-red-500 hover:bg-red-600">-{product.discount}%</Badge>
          )}
          {product.isNew && <Badge className="absolute top-2 right-2 bg-green-500 hover:bg-green-600">新品</Badge>}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex justify-between items-center">
            <Button size="sm" variant="secondary" className="rounded-full" onClick={handleAddToCart}>
              <ShoppingCart className="h-4 w-4 mr-2" />
              加入购物车
            </Button>
            <Button size="icon" variant="secondary" className="rounded-full" onClick={toggleWishlist}>
              <Heart className={cn("h-4 w-4", isWishlisted && "fill-red-500 text-red-500")} />
              <span className="sr-only">添加到收藏</span>
            </Button>
          </div>
        </div>
        <CardContent className="p-4">
          <div className="text-sm text-muted-foreground mb-1">{product.category}</div>
          <h3 className="font-medium line-clamp-2 mb-1">{product.name}</h3>
          <div className="flex items-center gap-2 mb-2">
            <div className="flex">
              {Array(5)
                .fill(0)
                .map((_, i) => (
                  <Star
                    key={i}
                    className={cn(
                      "w-4 h-4",
                      i < Math.floor(product.rating) ? "fill-yellow-400 text-yellow-400" : "fill-muted text-muted",
                    )}
                  />
                ))}
            </div>
            <span className="text-xs text-muted-foreground">({product.reviewCount})</span>
          </div>
        </CardContent>
        <CardFooter className="p-4 pt-0 flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="font-bold text-lg">¥{product.price.toFixed(2)}</span>
            {product.discount > 0 && (
              <span className="text-sm text-muted-foreground line-through">
                ¥{(product.price / (1 - product.discount / 100)).toFixed(2)}
              </span>
            )}
          </div>
          {product.stock <= 5 && product.stock > 0 && (
            <span className="text-xs text-orange-500">仅剩 {product.stock} 件</span>
          )}
        </CardFooter>
      </Link>
    </Card>
  )
}
