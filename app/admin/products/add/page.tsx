"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ChevronLeft, Plus, X, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/lib/hooks/use-auth"
import { createProduct } from "@/lib/actions/products"
import { getCategories } from "@/lib/actions/categories"
import type { Category } from "@/lib/types"

export default function AddProductPage() {
  const router = useRouter()
  const { user, isAdmin } = useAuth()
  const { toast } = useToast()
  
  const [loading, setLoading] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [features, setFeatures] = useState<string[]>([''])
  const [specifications, setSpecifications] = useState<{[key: string]: string}>({
    '': ''
  })
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    image: '/placeholder.svg',
    category: '',
    stock: '10',
    discount: '0',
    isNew: true
  })

  // 如果用户未登录或不是管理员，重定向到登录页面
  useEffect(() => {
    if (!user) {
      router.push("/login?redirect=/admin/products/add")
    } else if (!isAdmin) {
      router.push("/")
    } else {
      // 加载分类数据
      loadCategories()
    }
  }, [user, isAdmin, router])
  
  // 加载分类数据
  const loadCategories = async () => {
    try {
      const response = await getCategories()
      if (response && response.categories) {
        setCategories(response.categories)
      }
    } catch (err) {
      console.error("获取分类失败:", err)
    }
  }

  // 添加特点字段
  const addFeature = () => {
    setFeatures([...features, ''])
  }

  // 移除特点字段
  const removeFeature = (index: number) => {
    const newFeatures = [...features]
    newFeatures.splice(index, 1)
    setFeatures(newFeatures.length ? newFeatures : [''])
  }

  // 更新特点字段
  const updateFeature = (index: number, value: string) => {
    const newFeatures = [...features]
    newFeatures[index] = value
    setFeatures(newFeatures)
  }

  // 添加规格参数
  const addSpecification = () => {
    setSpecifications({...specifications, '': ''})
  }

  // 移除规格参数
  const removeSpecification = (key: string) => {
    const newSpecs = {...specifications}
    delete newSpecs[key]
    
    // 如果没有规格参数，添加一个空的
    if (Object.keys(newSpecs).length === 0) {
      newSpecs[''] = ''
    }
    
    setSpecifications(newSpecs)
  }

  // 更新规格参数键
  const updateSpecificationKey = (oldKey: string, newKey: string) => {
    const newSpecs = {...specifications}
    const value = newSpecs[oldKey]
    delete newSpecs[oldKey]
    newSpecs[newKey] = value
    setSpecifications(newSpecs)
  }

  // 更新规格参数值
  const updateSpecificationValue = (key: string, value: string) => {
    setSpecifications({...specifications, [key]: value})
  }

  // 处理表单变化
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  // 处理Switch变化
  const handleSwitchChange = (checked: boolean) => {
    setFormData({ ...formData, isNew: checked })
  }

  // 提交表单
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // 验证表单
    if (!formData.name.trim()) {
      toast({
        title: "商品名称不能为空",
        variant: "destructive"
      })
      return
    }

    if (!formData.category) {
      toast({
        title: "请选择商品分类",
        variant: "destructive"
      })
      return
    }

    try {
      setLoading(true)
      
      // 处理价格和数量的转换
      const productData = {
        ...formData,
        price: parseFloat(formData.price) || 0,
        stock: parseInt(formData.stock) || 0,
        discount: parseFloat(formData.discount) || 0,
        features: features.filter(f => f.trim()),
        specifications: Object.fromEntries(
          Object.entries(specifications).filter(([k, v]) => k.trim() && v.trim())
        )
      }
      
      const response = await createProduct(productData)
      
      toast({
        title: "添加成功",
        description: "商品已成功添加"
      })
      
      // 重定向到商品列表或查看页面
      router.push("/admin")
    } catch (err: any) {
      console.error("添加商品失败:", err)
      toast({
        title: "添加失败",
        description: err.data?.message || "添加商品失败，请稍后再试",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  if (!user || !isAdmin) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <p>正在检查权限...</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">添加商品</h1>
        <Button asChild variant="outline">
          <Link href="/admin">
            <ChevronLeft className="mr-2 h-4 w-4" />
            返回商品列表
          </Link>
        </Button>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>基本信息</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">商品名称 <span className="text-red-500">*</span></Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="输入商品名称"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">商品描述</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="输入商品描述"
                    rows={4}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="image">商品图片 URL</Label>
                  <Input
                    id="image"
                    name="image"
                    value={formData.image}
                    onChange={handleChange}
                    placeholder="输入商品图片 URL"
                  />
                  <p className="text-xs text-muted-foreground">
                    输入商品图片URL（默认使用占位图）
                  </p>
                </div>

                <div className="space-y-2">
                  <Label>商品特点</Label>
                  <div className="space-y-2">
                    {features.map((feature, index) => (
                      <div key={index} className="flex gap-2">
                        <Input
                          value={feature}
                          onChange={(e) => updateFeature(index, e.target.value)}
                          placeholder={`特点 ${index + 1}`}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() => removeFeature(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="mt-2"
                      onClick={addFeature}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      添加特点
                    </Button>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label>规格参数</Label>
                  <div className="space-y-2">
                    {Object.entries(specifications).map(([key, value], index) => (
                      <div key={index} className="flex gap-2">
                        <Input
                          value={key}
                          onChange={(e) => updateSpecificationKey(key, e.target.value)}
                          placeholder="参数名称"
                          className="w-1/3"
                        />
                        <Input
                          value={value}
                          onChange={(e) => updateSpecificationValue(key, e.target.value)}
                          placeholder="参数值"
                          className="flex-1"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() => removeSpecification(key)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="mt-2"
                      onClick={addSpecification}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      添加规格
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>价格与库存</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="price">价格 (¥) <span className="text-red-500">*</span></Label>
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.price}
                    onChange={handleChange}
                    placeholder="0.00"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="discount">折扣 (0-1)</Label>
                  <Input
                    id="discount"
                    name="discount"
                    type="number"
                    min="0"
                    max="1"
                    step="0.01"
                    value={formData.discount}
                    onChange={handleChange}
                    placeholder="0"
                  />
                  <p className="text-xs text-muted-foreground">
                    例如：0.2 表示 8 折，即原价的 80%
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="stock">库存数量</Label>
                  <Input
                    id="stock"
                    name="stock"
                    type="number"
                    min="0"
                    step="1"
                    value={formData.stock}
                    onChange={handleChange}
                    placeholder="0"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>分类与状态</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="category">商品分类 <span className="text-red-500">*</span></Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => setFormData({...formData, category: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="选择分类" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.slug}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="is-new">新品</Label>
                  <Switch
                    id="is-new"
                    checked={formData.isNew}
                    onCheckedChange={handleSwitchChange}
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      添加中...
                    </>
                  ) : "添加商品"}
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </form>
    </div>
  )
} 