"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Package, Search, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/lib/hooks/use-auth"
import { useToast } from "@/components/ui/use-toast"
import { getOrders, cancelOrder } from "@/lib/actions/orders"

// 订单状态映射
const statusMap: Record<string, string> = {
  'pending': '待处理',
  'processing': '处理中',
  'shipped': '已发货',
  'delivered': '已送达',
  'cancelled': '已取消'
}

// 状态颜色映射
const statusColorMap: Record<string, string> = {
  'pending': 'bg-yellow-500',
  'processing': 'bg-blue-500',
  'shipped': 'bg-purple-500',
  'delivered': 'bg-green-500',
  'cancelled': 'bg-red-500'
}

export default function OrdersPage() {
  const router = useRouter()
  const { user } = useAuth()
  const { toast } = useToast()
  
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("all")

  // 加载订单数据
  useEffect(() => {
    if (user) {
      loadOrders()
    }
  }, [user])

  // 加载订单
  const loadOrders = async () => {
    try {
      setLoading(true)
      const params: Record<string, string> = {}
      if (activeTab !== "all") {
        params.status = activeTab
      }
      
      const response = await getOrders(params)
      if (response && response.orders) {
        setOrders(response.orders)
      } else {
        setOrders([])
      }
      setError("")
    } catch (err: any) {
      console.error("加载订单失败:", err)
      setError(err.message || "加载订单失败")
      toast({
        title: "加载失败",
        description: "无法加载订单数据，请稍后再试",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  // 取消订单
  const handleCancelOrder = async (orderId: string) => {
    try {
      await cancelOrder(orderId)
      toast({
        title: "订单已取消",
        description: "您的订单已成功取消",
      })
      // 重新加载订单
      loadOrders()
    } catch (err: any) {
      console.error("取消订单失败:", err)
      toast({
        title: "取消失败",
        description: err.data?.message || "无法取消订单，请稍后再试",
        variant: "destructive"
      })
    }
  }

  // 处理标签切换
  const handleTabChange = (value: string) => {
    setActiveTab(value)
    // 当标签改变时重新加载数据
    setTimeout(() => {
      loadOrders()
    }, 0)
  }

  // 如果用户未登录，重定向到登录页面
  useEffect(() => {
    if (!user) {
      router.push("/login?redirect=/orders")
    }
  }, [user, router])

  if (!user) {
    return null // 等待重定向
  }

  // 过滤搜索结果
  const filteredOrders = orders.filter((order: any) => 
    order.id.toString().includes(searchTerm) || 
    order.items.some((item: any) => 
      item.product_name.toLowerCase().includes(searchTerm.toLowerCase())
    )
  )

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-6">我的订单</h1>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
        <div className="relative w-full sm:w-auto">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            type="search" 
            placeholder="搜索订单..." 
            className="pl-8 w-full sm:w-[300px]" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <Button asChild>
          <Link href="/products">继续购物</Link>
        </Button>
      </div>

      <Tabs defaultValue="all" onValueChange={handleTabChange}>
        <TabsList className="mb-6">
          <TabsTrigger value="all">全部订单</TabsTrigger>
          <TabsTrigger value="pending">待处理</TabsTrigger>
          <TabsTrigger value="processing">处理中</TabsTrigger>
          <TabsTrigger value="shipped">已发货</TabsTrigger>
          <TabsTrigger value="delivered">已送达</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-0">
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2">加载订单数据...</span>
            </div>
          ) : error ? (
            <div className="text-center py-12 border rounded-lg">
              <p className="text-red-500">{error}</p>
              <Button onClick={loadOrders} className="mt-4">重试</Button>
            </div>
          ) : filteredOrders.length > 0 ? (
            <div className="grid gap-6">
              {filteredOrders.map((order: any) => (
                <Card key={order.id}>
                  <CardHeader className="pb-2">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                      <div>
                        <CardTitle className="text-lg">订单 #{order.id}</CardTitle>
                        <CardDescription>下单时间: {new Date(order.created_at).toLocaleDateString('zh-CN')}</CardDescription>
                      </div>
                      <Badge className={statusColorMap[order.status] || 'bg-gray-500'}>
                        {statusMap[order.status] || order.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {order.items && order.items.map((item: any) => (
                        <div key={item.id} className="flex gap-4">
                          <div className="relative w-16 h-16 rounded-md overflow-hidden flex-shrink-0">
                            <Image
                              src={item.image || "/placeholder.svg"}
                              alt={item.product_name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="flex-1">
                            <Link href={`/products/${item.product_id}`} className="font-medium hover:text-primary">
                              {item.product_name}
                            </Link>
                            <div className="text-sm text-muted-foreground mt-1">
                              数量: {item.quantity} × ¥{parseFloat(item.price).toFixed(2)}
                            </div>
                          </div>
                        </div>
                      ))}

                      <div className="flex justify-between pt-4 border-t">
                        <span className="font-medium">总计</span>
                        <span className="font-medium">¥{parseFloat(order.total_amount).toFixed(2)}</span>
                      </div>

                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/orders/${order.id}`}>查看详情</Link>
                        </Button>
                        {order.status === 'pending' && (
                          <Button 
                            variant="destructive" 
                            size="sm" 
                            onClick={() => handleCancelOrder(order.id)}
                          >
                            取消订单
                          </Button>
                        )}
                        {order.status === 'delivered' && (
                          <Button size="sm" asChild>
                            <Link href={`/products/${order.items[0]?.product_id}/review`}>评价商品</Link>
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 border rounded-lg">
              <Package className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h2 className="text-lg font-medium mb-2">暂无订单</h2>
              <p className="text-muted-foreground mb-6">您还没有任何订单记录</p>
              <Button asChild>
                <Link href="/products">开始购物</Link>
              </Button>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
