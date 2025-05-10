"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { useParams } from "next/navigation"
import { ChevronLeft, Heart, Share, ShoppingCart, Star, Truck, Shield, RotateCcw, Clock, Loader2, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { useCart } from "@/lib/hooks/use-cart"
import { useAuth } from "@/lib/hooks/use-auth"
import ProductCard from "@/components/product-card"
import { getProduct, getProducts } from "@/lib/actions/products"
import { getProductComments, addProductComment } from "@/lib/actions/comments"
import type { Product, Comment } from "@/lib/types"

// 星级评分组件
const StarRating = ({ rating, size = 20, interactive = false, onChange = (rating: number) => {} }: { 
  rating: number; 
  size?: number; 
  interactive?: boolean; 
  onChange?: (rating: number) => void 
}) => {
  const [hoverRating, setHoverRating] = useState(0)
  
  return (
    <div className="flex">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          className={`${interactive ? 'cursor-pointer' : 'cursor-default'}`}
          onClick={() => interactive && onChange(star)}
          onMouseEnter={() => interactive && setHoverRating(star)}
          onMouseLeave={() => interactive && setHoverRating(0)}
        >
          <Star
            fill={(hoverRating || rating) >= star ? "gold" : "none"}
            stroke={(hoverRating || rating) >= star ? "gold" : "currentColor"}
            size={size}
          />
        </button>
      ))}
    </div>
  )
}

// 评论日期格式化
const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

export default function ProductPage() {
  const params = useParams()
  const productId = params.id as string
  const { addToCart } = useCart()
  const { user } = useAuth()
  const { toast } = useToast()

  const [product, setProduct] = useState<Product | null>(null)
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([])
  const [comments, setComments] = useState<Comment[]>([])
  const [totalComments, setTotalComments] = useState(0)
  const [loading, setLoading] = useState(true)
  const [commentLoading, setCommentLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const [error, setError] = useState("")
  
  // 评论表单状态
  const [commentForm, setCommentForm] = useState({
    rating: 5,
    content: ""
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  // 加载产品数据
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        // 获取产品详情
        const productResponse = await getProduct(productId)
        if (productResponse) {
          setProduct(productResponse)
          
          // 获取相关产品
          const relatedResponse = await getProducts({ 
            category: productResponse.category,
            limit: '4'
          })
          
          if (relatedResponse && relatedResponse.products) {
            // 过滤掉当前产品
            const filtered = relatedResponse.products.filter((p: Product) => p.id !== productResponse.id)
            setRelatedProducts(filtered.slice(0, 4))
          }
          
          // 加载评论
          await loadComments()
        }
        setError("")
      } catch (err: any) {
        console.error("加载产品数据失败:", err)
        setError(err.data?.message || "加载产品数据失败")
        toast({
          title: "加载失败",
          description: "无法加载产品数据，请稍后再试",
          variant: "destructive"
        })
      } finally {
        setLoading(false)
      }
    }

    if (productId) {
      fetchData()
    }
  }, [productId, toast])

  // 加载商品评论
  const loadComments = async () => {
    try {
      setCommentLoading(true)
      const commentsResponse = await getProductComments(productId)
      if (commentsResponse) {
        setComments(commentsResponse.comments || [])
        setTotalComments(commentsResponse.total || 0)
      }
    } catch (err) {
      console.error("加载评论失败:", err)
    } finally {
      setCommentLoading(false)
    }
  }

  // 提交评论
  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!user) {
      toast({
        title: "请先登录",
        description: "发表评论前请先登录您的账户",
        variant: "destructive"
      })
      return
    }
    
    if (commentForm.content.trim() === "") {
      toast({
        title: "评论内容不能为空",
        description: "请输入您的评价内容",
        variant: "destructive"
      })
      return
    }
    
    try {
      setIsSubmitting(true)
      await addProductComment(productId, commentForm)
      
      toast({
        title: "评价成功",
        description: "感谢您的评价！"
      })
      
      // 重置表单
      setCommentForm({
        rating: 5,
        content: ""
      })
      
      // 重新加载评论
      await loadComments()
    } catch (err: any) {
      console.error("提交评论失败:", err)
      toast({
        title: "评价失败",
        description: err.data?.message || "无法提交您的评价，请稍后再试",
        variant: "destructive"
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // 增加商品数量
  const incrementQuantity = () => {
    if (product && quantity < product.stock) {
      setQuantity(quantity + 1)
    } else {
      toast({
        title: "已达最大数量",
        description: "无法再增加数量"
      })
    }
  }

  // 减少商品数量
  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1)
    }
  }

  // 添加到购物车
  const handleAddToCart = () => {
    if (!product) return
    
    addToCart(product, quantity)
    
    toast({
      title: "已添加到购物车",
      description: `${product.name} x ${quantity} 已添加到购物车`
    })
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 flex justify-center items-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary mr-2" />
        <span>加载商品数据...</span>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <p className="text-red-500 font-medium mb-4">{error || "商品不存在"}</p>
        <Button asChild>
          <Link href="/products">返回商品列表</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-6">
      {/* 返回按钮 */}
      <Button variant="ghost" className="mb-6" asChild>
        <Link href="/products">
          <ChevronLeft className="h-4 w-4 mr-2" />
          返回商品列表
        </Link>
      </Button>

      {/* 商品基本信息 */}
      <div className="grid md:grid-cols-2 gap-8 mb-12">
        {/* 商品图片 */}
        <div className="relative aspect-square rounded-lg overflow-hidden border">
          <Image
            src={product.image || "/placeholder.svg"}
            alt={product.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
          />
        </div>

        {/* 商品信息 */}
        <div>
          <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
          
          <div className="flex items-center mb-4">
            <StarRating rating={product.rating} />
            <span className="ml-2 text-muted-foreground">
              {product.rating.toFixed(1)} ({totalComments} 条评价)
            </span>
          </div>

          <div className="mb-4">
            {product.discount > 0 ? (
              <div className="space-x-2">
                <span className="text-2xl font-bold">¥{parseFloat(product.price.toString()).toFixed(2)}</span>
                <span className="text-lg line-through text-muted-foreground">
                  ¥{parseFloat((product.price * (1 + product.discount)).toString()).toFixed(2)}
                </span>
                <Badge className="bg-red-500">
                  -{(product.discount * 100).toFixed(0)}%
                </Badge>
              </div>
            ) : (
              <span className="text-2xl font-bold">¥{parseFloat(product.price.toString()).toFixed(2)}</span>
            )}
          </div>

          <p className="text-muted-foreground mb-6">{product.description}</p>

          <div className="flex items-center text-sm text-muted-foreground mb-6">
            <div className="flex items-center mr-4">
              <Truck className="h-4 w-4 mr-1" />
              <span>3-5 天送达</span>
            </div>
            <div className="flex items-center mr-4">
              <Shield className="h-4 w-4 mr-1" />
              <span>30天退换保障</span>
            </div>
            <div className="flex items-center">
              <RotateCcw className="h-4 w-4 mr-1" />
              <span>7天无理由退货</span>
            </div>
          </div>

          {/* 库存状态 */}
          <div className="mb-6">
            {product.stock > 0 ? (
              <Badge variant="outline" className="text-green-500 border-green-500">
                有库存 ({product.stock})
              </Badge>
            ) : (
              <Badge variant="outline" className="text-red-500 border-red-500">
                缺货
              </Badge>
            )}
          </div>

          {/* 数量和按钮 */}
          <div className="space-y-4">
            <div className="flex items-center">
              <Label htmlFor="quantity" className="mr-4">
                数量:
              </Label>
              <div className="flex items-center">
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="h-9 w-9 rounded-r-none"
                  onClick={decrementQuantity}
                  disabled={quantity <= 1}
                >
                  -
                </Button>
                <Input
                  id="quantity"
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                  min="1"
                  max={product.stock}
                  className="h-9 w-16 rounded-none text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="h-9 w-9 rounded-l-none"
                  onClick={incrementQuantity}
                  disabled={quantity >= product.stock}
                >
                  +
                </Button>
              </div>
            </div>

            <div className="flex flex-wrap gap-4">
              <Button 
                className="flex-1" 
                onClick={handleAddToCart} 
                disabled={product.stock <= 0}
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                加入购物车
              </Button>
              <Button variant="outline" size="icon">
                <Heart className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon">
                <Share className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* 商品详情标签页 */}
      <Tabs defaultValue="details" className="mb-12">
        <TabsList className="mb-4">
          <TabsTrigger value="details">商品详情</TabsTrigger>
          <TabsTrigger value="specifications">规格参数</TabsTrigger>
          <TabsTrigger value="reviews">用户评价 ({totalComments})</TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="space-y-4">
          <div className="prose max-w-none">
            <h3>产品特点</h3>
            {product.features && product.features.length > 0 ? (
              <ul>
                {product.features.map((feature, index) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul>
            ) : (
              <p>暂无产品特点信息</p>
            )}
          </div>
        </TabsContent>

        <TabsContent value="specifications">
          <div className="border rounded-lg overflow-hidden">
            <table className="w-full">
              <tbody>
                {product.specifications && Object.entries(product.specifications).length > 0 ? (
                  Object.entries(product.specifications).map(([key, value]) => (
                    <tr key={key} className="border-b last:border-0">
                      <td className="bg-muted px-4 py-2 font-medium w-1/3">{key}</td>
                      <td className="px-4 py-2">{value}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td className="px-4 py-2 text-center text-muted-foreground" colSpan={2}>
                      暂无规格参数信息
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </TabsContent>

        <TabsContent value="reviews">
          <div className="space-y-6">
            {/* 评论表单 */}
            <div className="bg-muted rounded-lg p-4 mb-6">
              <h3 className="text-lg font-medium mb-4">写下您的评价</h3>
              {user ? (
                <form onSubmit={handleSubmitComment}>
                  <div className="mb-4">
                    <Label htmlFor="rating" className="block mb-2">
                      评分
                    </Label>
                    <StarRating 
                      rating={commentForm.rating} 
                      interactive={true} 
                      onChange={(value) => setCommentForm(prev => ({ ...prev, rating: value }))}
                    />
                  </div>
                  <div className="mb-4">
                    <Label htmlFor="comment" className="block mb-2">
                      评价内容
                    </Label>
                    <Textarea
                      id="comment"
                      placeholder="分享您对这个商品的看法..."
                      rows={4}
                      value={commentForm.content}
                      onChange={(e) => setCommentForm(prev => ({ ...prev, content: e.target.value }))}
                      required
                    />
                  </div>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        提交中...
                      </>
                    ) : "提交评价"}
                  </Button>
                </form>
              ) : (
                <div className="text-center py-4">
                  <p className="mb-4">请登录后评价商品</p>
                  <Button asChild>
                    <Link href={`/login?redirect=/products/${productId}`}>登录</Link>
                  </Button>
                </div>
              )}
            </div>

            {/* 评论列表 */}
            <div>
              <h3 className="text-lg font-medium mb-4">用户评价 ({totalComments})</h3>
              
              {commentLoading ? (
                <div className="text-center py-6">
                  <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2" />
                  <p>加载评论中...</p>
                </div>
              ) : comments.length > 0 ? (
                <div className="space-y-6">
                  {comments.map((comment) => (
                    <div key={comment.id} className="border-b pb-6 last:border-0">
                      <div className="flex justify-between mb-2">
                        <div className="flex items-center">
                          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mr-2">
                            <User className="h-5 w-5" />
                          </div>
                          <div>
                            <div className="font-medium">{comment.userName}</div>
                            <StarRating rating={comment.rating} size={16} />
                          </div>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          <Clock className="h-3 w-3 inline-block mr-1" />
                          {formatDate(comment.createdAt)}
                        </div>
                      </div>
                      <p className="mt-2">{comment.content}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 border rounded-lg">
                  <p className="text-muted-foreground">暂无评价</p>
                </div>
              )}
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* 相关商品 */}
      {relatedProducts.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">相关商品</h2>
            <Button variant="ghost" asChild>
              <Link href={`/categories/${product.category}`}>查看更多</Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {relatedProducts.map((relatedProduct) => (
              <ProductCard key={relatedProduct.id} product={relatedProduct} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
