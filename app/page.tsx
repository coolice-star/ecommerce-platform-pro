"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowRight } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import HeroCarousel from "@/components/hero-carousel"
import ProductCard from "@/components/product-card"
import { getProducts } from "@/lib/actions/products"
import { getCategories } from "@/lib/actions/categories"
import type { Product, Category } from "@/lib/types"

export default function Home() {
  const [categories, setCategories] = useState<Category[]>([])
  const [allProducts, setAllProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setError(false)
        
        // 获取所有分类
        const categoriesData = await getCategories()
        // 确保categories是数组
        if (categoriesData && Array.isArray(categoriesData)) {
          setCategories(categoriesData)
        } else if (categoriesData && Array.isArray(categoriesData.categories)) {
          setCategories(categoriesData.categories)
        } else {
          console.error("分类数据格式不正确:", categoriesData)
          setCategories([])
        }
        
        // 获取所有商品
        const productsData = await getProducts()
        if (productsData && Array.isArray(productsData)) {
          setAllProducts(productsData)
        } else if (productsData && Array.isArray(productsData.products)) {
          setAllProducts(productsData.products)
        } else {
          console.error("商品数据格式不正确:", productsData)
          setAllProducts([])
        }
      } catch (error) {
        console.error("获取数据失败:", error)
        setError(true)
      } finally {
        setLoading(false)
      }
    }
    
    fetchData()
  }, [])

  // 过滤出电子产品
  const electronicsProducts = allProducts.filter(
    (p) => p.category === "electronics"
  )
  
  // 过滤出图书
  const booksProducts = allProducts.filter(
    (p) => p.category === "books"
  )
  
  // 过滤出服装
  const clothingProducts = allProducts.filter(
    (p) => p.category === "clothing"
  )
  
  // 获取最新商品
  const newProducts = [...allProducts]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 4)

  // 如果发生错误，显示错误信息
  if (error) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">加载失败</h1>
        <p className="mb-6">抱歉，获取数据失败，请稍后再试。</p>
        <Button onClick={() => window.location.reload()}>
          重新加载
        </Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Hero Section */}
      <section className="mb-12">
        <HeroCarousel />
      </section>

      {/* Categories Section */}
      <section className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">热门分类</h2>
          <Link href="/categories" className="text-primary flex items-center">
            查看全部 <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </div>
        {loading ? (
          <p className="text-center py-8">加载中...</p>
        ) : categories.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {categories.map((category) => (
              <Link key={category.id} href={`/categories/${category.slug}`}>
                <Card className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                    <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-3">
                      {/* 使用首字母作为图标 */}
                      <span className="text-2xl font-bold">{category.name ? category.name.charAt(0) : '?'}</span>
                    </div>
                    <h3 className="font-medium">{category.name || '未命名分类'}</h3>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-center py-8">暂无分类数据</p>
        )}
      </section>

      {/* Featured Products */}
      <section className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">精选商品</h2>
          <Link href="/products" className="text-primary flex items-center">
            查看全部 <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </div>
        {loading ? (
          <p className="text-center py-8">加载中...</p>
        ) : allProducts.length > 0 ? (
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="all">全部</TabsTrigger>
              <TabsTrigger value="electronics">电子产品</TabsTrigger>
              <TabsTrigger value="books">图书</TabsTrigger>
              <TabsTrigger value="clothing">服装</TabsTrigger>
            </TabsList>
            <TabsContent value="all" className="mt-0">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {allProducts.slice(0, 8).map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </TabsContent>
            <TabsContent value="electronics" className="mt-0">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {electronicsProducts.slice(0, 8).map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </TabsContent>
            <TabsContent value="books" className="mt-0">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {booksProducts.slice(0, 8).map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </TabsContent>
            <TabsContent value="clothing" className="mt-0">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {clothingProducts.slice(0, 8).map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </TabsContent>
          </Tabs>
        ) : (
          <p className="text-center py-8">暂无商品数据</p>
        )}
      </section>

      {/* Promotion Banner */}
      <section className="mb-12">
        <div className="relative rounded-lg overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-primary/40 z-10"></div>
          <Image
            src="/placeholder.svg?height=400&width=1200"
            alt="促销活动"
            width={1200}
            height={400}
            className="w-full h-[200px] md:h-[300px] object-cover"
          />
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-white p-6 text-center">
            <h2 className="text-2xl md:text-4xl font-bold mb-4">限时特惠</h2>
            <p className="text-lg md:text-xl mb-6 max-w-xl">新用户注册即可获得优惠券，全场商品满减活动进行中！</p>
            <Button size="lg" className="bg-white text-primary hover:bg-white/90">
              立即抢购
            </Button>
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      <section className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">新品上市</h2>
          <Link href="/products/new" className="text-primary flex items-center">
            查看全部 <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </div>
        {loading ? (
          <p className="text-center py-8">加载中...</p>
        ) : newProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {newProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <p className="text-center py-8">暂无新品数据</p>
        )}
      </section>
    </div>
  )
}
