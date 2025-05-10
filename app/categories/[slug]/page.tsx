"use client"

import { useParams } from "next/navigation"
import Link from "next/link"
import { ChevronLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import ProductCard from "@/components/product-card"
import { categories, featuredProducts } from "@/lib/data"

export default function CategoryPage() {
  const params = useParams()
  const slug = params.slug as string

  const category = categories.find((c) => c.slug === slug)
  const products = featuredProducts.filter((p) => p.category === slug)

  if (!category) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">分类不存在</h1>
        <p className="mb-6">抱歉，您查找的分类不存在或已被删除。</p>
        <Button asChild>
          <Link href="/categories">返回分类列表</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6">
        <Link href="/categories" className="flex items-center text-muted-foreground hover:text-primary">
          <ChevronLeft className="h-4 w-4 mr-1" />
          返回分类列表
        </Link>
      </div>

      <div className="flex items-center gap-4 mb-8">
        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">{category.icon}</div>
        <div>
          <h1 className="text-3xl font-bold">{category.name}</h1>
          <p className="text-muted-foreground">共 {products.length} 件商品</p>
        </div>
      </div>

      {products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 border rounded-lg">
          <p className="text-muted-foreground mb-4">该分类下暂无商品</p>
          <Button asChild>
            <Link href="/products">浏览所有商品</Link>
          </Button>
        </div>
      )}
    </div>
  )
}
