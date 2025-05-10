"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Filter, Search, SlidersHorizontal, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
  SheetFooter,
} from "@/components/ui/sheet"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Slider } from "@/components/ui/slider"
import { useToast } from "@/components/ui/use-toast"
import ProductCard from "@/components/product-card"
import { getProducts } from "@/lib/actions/products"
import { getCategories } from "@/lib/actions/categories"
import type { Product, Category } from "@/lib/types"

export default function ProductsPage() {
  const searchParams = useSearchParams()
  const categoryParam = searchParams.get("category")
  const { toast } = useToast()

  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(categoryParam)
  const [priceRange, setPriceRange] = useState([0, 10000])
  const [sortBy, setSortBy] = useState("featured")
  const [inStock, setInStock] = useState(true)
  const [onSale, setOnSale] = useState(false)
  const [newArrivals, setNewArrivals] = useState(false)

  // 加载产品和分类数据
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        // 获取分类数据
        const categoriesResponse = await getCategories()
        if (categoriesResponse && categoriesResponse.categories) {
          setCategories(categoriesResponse.categories)
        }

        // 获取产品数据
        const productsParams: Record<string, string> = {}
        if (selectedCategory) {
          productsParams.category = selectedCategory
        }
        
        const productsResponse = await getProducts(productsParams)
        if (productsResponse && productsResponse.products) {
          setProducts(productsResponse.products)
        }
        
        setError("")
      } catch (err: any) {
        console.error("加载数据失败:", err)
        setError(err.message || "加载数据失败")
        toast({
          title: "加载失败",
          description: "无法加载产品数据，请稍后再试",
          variant: "destructive"
        })
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [selectedCategory, toast])

  // 过滤和排序产品
  const filteredProducts = products
    .filter((product) => {
      // 搜索词过滤
      if (searchTerm && !product.name.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false
      }

      // 价格范围过滤
      const price = parseFloat(product.price.toString())
      if (price < priceRange[0] || price > priceRange[1]) {
        return false
      }

      // 库存过滤
      if (inStock && product.stock <= 0) {
        return false
      }

      // 折扣过滤
      if (onSale && (!product.discount || parseFloat(product.discount.toString()) <= 0)) {
        return false
      }

      // 新品过滤 (假设有isNew字段或者可以根据创建日期判断)
      if (newArrivals) {
        const createdDate = new Date(product.createdAt);
        const oneMonthAgo = new Date();
        oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
        if (createdDate < oneMonthAgo) {
          return false;
        }
      }

      return true
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "price-asc":
          return parseFloat(a.price.toString()) - parseFloat(b.price.toString())
        case "price-desc":
          return parseFloat(b.price.toString()) - parseFloat(a.price.toString())
        case "newest":
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        case "rating":
          return b.rating - a.rating
        default:
          return 0
      }
    })

  // 当URL参数变化时更新分类
  useEffect(() => {
    if (categoryParam) {
      setSelectedCategory(categoryParam)
    }
  }, [categoryParam])

  // 重置筛选条件
  const resetFilters = () => {
    setSearchTerm("")
    setSelectedCategory(null)
    setPriceRange([0, 10000])
    setSortBy("featured")
    setInStock(true)
    setOnSale(false)
    setNewArrivals(false)
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-6">全部商品</h1>

      <div className="flex flex-col md:flex-row gap-6">
        {/* 桌面端筛选器 */}
        <div className="hidden md:block w-64 flex-shrink-0">
          <div className="sticky top-20">
            <div className="border rounded-lg p-4">
              <h2 className="font-medium mb-4">筛选条件</h2>

              <Accordion type="multiple" defaultValue={["category", "price"]}>
                <AccordionItem value="category">
                  <AccordionTrigger>商品分类</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="all-categories"
                          checked={!selectedCategory}
                          onCheckedChange={() => setSelectedCategory(null)}
                        />
                        <Label htmlFor="all-categories">全部分类</Label>
                      </div>
                      {categories.map((category) => (
                        <div key={category.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={`category-${category.id}`}
                            checked={selectedCategory === category.slug}
                            onCheckedChange={() => setSelectedCategory(category.slug)}
                          />
                          <Label htmlFor={`category-${category.id}`}>{category.name}</Label>
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="price">
                  <AccordionTrigger>价格范围</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4">
                      <Slider
                        defaultValue={[0, 10000]}
                        max={10000}
                        step={100}
                        value={priceRange}
                        onValueChange={setPriceRange}
                      />
                      <div className="flex items-center justify-between">
                        <span>¥{priceRange[0]}</span>
                        <span>¥{priceRange[1]}</span>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="availability">
                  <AccordionTrigger>商品状态</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="in-stock"
                          checked={inStock}
                          onCheckedChange={(checked) => setInStock(checked as boolean)}
                        />
                        <Label htmlFor="in-stock">有库存</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="on-sale"
                          checked={onSale}
                          onCheckedChange={(checked) => setOnSale(checked as boolean)}
                        />
                        <Label htmlFor="on-sale">促销商品</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="new-arrivals"
                          checked={newArrivals}
                          onCheckedChange={(checked) => setNewArrivals(checked as boolean)}
                        />
                        <Label htmlFor="new-arrivals">新品上市</Label>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>

              <Separator className="my-4" />

              <Button
                variant="outline"
                className="w-full"
                onClick={resetFilters}
              >
                重置筛选
              </Button>
            </div>
          </div>
        </div>

        {/* 主内容区 */}
        <div className="flex-1">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
            <div className="relative w-full sm:w-auto">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="搜索商品..."
                className="pl-8 w-full sm:w-[300px]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="排序方式" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="featured">推荐排序</SelectItem>
                  <SelectItem value="price-asc">价格从低到高</SelectItem>
                  <SelectItem value="price-desc">价格从高到低</SelectItem>
                  <SelectItem value="newest">最新上架</SelectItem>
                  <SelectItem value="rating">评分最高</SelectItem>
                </SelectContent>
              </Select>

              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="icon" className="md:hidden">
                    <SlidersHorizontal className="h-4 w-4" />
                    <span className="sr-only">筛选</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="left">
                  <SheetHeader>
                    <SheetTitle>筛选条件</SheetTitle>
                    <SheetDescription>根据您的需求筛选商品</SheetDescription>
                  </SheetHeader>

                  <div className="py-4">
                    <Accordion type="multiple" defaultValue={["category", "price"]}>
                      <AccordionItem value="category">
                        <AccordionTrigger>商品分类</AccordionTrigger>
                        <AccordionContent>
                          <div className="space-y-2">
                            <div className="flex items-center space-x-2">
                              <Checkbox
                                id="mobile-all-categories"
                                checked={!selectedCategory}
                                onCheckedChange={() => setSelectedCategory(null)}
                              />
                              <Label htmlFor="mobile-all-categories">全部分类</Label>
                            </div>
                            {categories.map((category) => (
                              <div key={`mobile-${category.id}`} className="flex items-center space-x-2">
                                <Checkbox
                                  id={`mobile-category-${category.id}`}
                                  checked={selectedCategory === category.slug}
                                  onCheckedChange={() => setSelectedCategory(category.slug)}
                                />
                                <Label htmlFor={`mobile-category-${category.id}`}>{category.name}</Label>
                              </div>
                            ))}
                          </div>
                        </AccordionContent>
                      </AccordionItem>

                      <AccordionItem value="price">
                        <AccordionTrigger>价格范围</AccordionTrigger>
                        <AccordionContent>
                          <div className="space-y-4">
                            <Slider
                              defaultValue={[0, 10000]}
                              max={10000}
                              step={100}
                              value={priceRange}
                              onValueChange={setPriceRange}
                            />
                            <div className="flex items-center justify-between">
                              <span>¥{priceRange[0]}</span>
                              <span>¥{priceRange[1]}</span>
                            </div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>

                      <AccordionItem value="availability">
                        <AccordionTrigger>商品状态</AccordionTrigger>
                        <AccordionContent>
                          <div className="space-y-2">
                            <div className="flex items-center space-x-2">
                              <Checkbox
                                id="mobile-in-stock"
                                checked={inStock}
                                onCheckedChange={(checked) => setInStock(checked as boolean)}
                              />
                              <Label htmlFor="mobile-in-stock">有库存</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Checkbox
                                id="mobile-on-sale"
                                checked={onSale}
                                onCheckedChange={(checked) => setOnSale(checked as boolean)}
                              />
                              <Label htmlFor="mobile-on-sale">促销商品</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Checkbox
                                id="mobile-new-arrivals"
                                checked={newArrivals}
                                onCheckedChange={(checked) => setNewArrivals(checked as boolean)}
                              />
                              <Label htmlFor="mobile-new-arrivals">新品上市</Label>
                            </div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </div>

                  <SheetFooter>
                    <SheetClose asChild>
                      <Button variant="outline" className="w-full" onClick={resetFilters}>
                        重置筛选
                      </Button>
                    </SheetClose>
                    <SheetClose asChild>
                      <Button className="w-full">应用筛选</Button>
                    </SheetClose>
                  </SheetFooter>
                </SheetContent>
              </Sheet>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2">加载产品数据...</span>
            </div>
          ) : error ? (
            <div className="text-center py-12 border rounded-lg">
              <p className="text-red-500">{error}</p>
              <Button onClick={() => window.location.reload()} className="mt-4">
                重试
              </Button>
            </div>
          ) : filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 border rounded-lg">
              <p className="text-lg font-medium mb-2">未找到匹配的商品</p>
              <p className="text-muted-foreground mb-6">尝试调整筛选条件或搜索其他关键词</p>
              <Button onClick={resetFilters}>重置所有筛选</Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
