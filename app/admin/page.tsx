"use client"

import { Label } from "@/components/ui/label"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import {
  Package,
  Users,
  ShoppingCart,
  BarChart3,
  PlusCircle,
  Search,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Loader2
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAuth } from "@/lib/hooks/use-auth"
import { useToast } from "@/components/ui/use-toast"
import { getProducts, deleteProduct } from "@/lib/actions/products"
import { getUsers, toggleAdmin } from "@/lib/actions/users"
import { getAdminOrders } from "@/lib/actions/orders"
import type { Product, User, Order } from "@/lib/types"

export default function AdminDashboard() {
  const router = useRouter()
  const { user, isAdmin } = useAuth()
  const { toast } = useToast()
  
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5
  
  const [loading, setLoading] = useState(true)
  const [products, setProducts] = useState<Product[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [stats, setStats] = useState({
    totalSales: 0,
    totalOrders: 0,
    totalProducts: 0,
    totalUsers: 0
  })

  // 如果用户未登录或不是管理员，重定向到登录页面
  useEffect(() => {
    if (!user) {
      router.push("/login?redirect=/admin")
    } else if (!isAdmin) {
      router.push("/")
    } else {
      // 加载数据
      loadData()
    }
  }, [user, isAdmin, router])
  
  // 加载数据
  const loadData = async () => {
    try {
      setLoading(true)
      
      // 加载商品数据
      const productsResponse = await getProducts()
      if (productsResponse && productsResponse.products) {
        setProducts(productsResponse.products)
        setStats(prev => ({ ...prev, totalProducts: productsResponse.total || productsResponse.products.length }))
      }
      
      // 加载用户数据
      const usersResponse = await getUsers()
      if (usersResponse && usersResponse.users) {
        setUsers(usersResponse.users)
        setStats(prev => ({ ...prev, totalUsers: usersResponse.total || usersResponse.users.length }))
      }
      
      // 加载订单数据
      const ordersResponse = await getAdminOrders()
      if (ordersResponse && ordersResponse.orders) {
        setOrders(ordersResponse.orders)
        
        // 计算总销售额和订单数
        const totalSales = ordersResponse.orders.reduce((sum: number, order: Order) => sum + order.totalAmount, 0)
        setStats(prev => ({ 
          ...prev, 
          totalSales: totalSales,
          totalOrders: ordersResponse.total || ordersResponse.orders.length 
        }))
      }
    } catch (err) {
      console.error("加载数据失败:", err)
      toast({
        title: "加载失败",
        description: "无法加载管理数据，请稍后再试",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  // 删除商品
  const handleDeleteProduct = async (productId: string) => {
    try {
      await deleteProduct(productId)
      toast({
        title: "删除成功",
        description: "商品已成功删除"
      })
      
      // 重新加载商品数据
      const productsResponse = await getProducts()
      if (productsResponse && productsResponse.products) {
        setProducts(productsResponse.products)
        setStats(prev => ({ ...prev, totalProducts: productsResponse.total || productsResponse.products.length }))
      }
    } catch (err: any) {
      console.error("删除商品失败:", err)
      toast({
        title: "删除失败",
        description: err.data?.message || "删除商品失败，请稍后再试",
        variant: "destructive"
      })
    }
  }

  if (!user || !isAdmin) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <p>正在检查权限...</p>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 flex justify-center items-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary mr-2" />
        <span>加载数据中...</span>
      </div>
    )
  }

  // 过滤产品
  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // 分页
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage)
  const paginatedProducts = filteredProducts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">管理后台</h1>
        <Button asChild variant="outline" size="sm">
          <Link href="/">
            <ChevronLeft className="mr-2 h-4 w-4" />
            返回商城
          </Link>
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">总销售额</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">¥{stats.totalSales.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              总计 <span className="text-green-500">{stats.totalOrders}</span> 笔订单
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">订单数</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalOrders}</div>
            <p className="text-xs text-muted-foreground">
              活跃订单 <span className="text-green-500">{orders.filter(o => o.status !== 'cancelled').length}</span>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">商品数</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalProducts}</div>
            <p className="text-xs text-muted-foreground">
              库存低 <span className="text-yellow-500">{products.filter(p => p.stock < 10).length}</span>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">用户数</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
            <p className="text-xs text-muted-foreground">
              管理员 <span className="text-green-500">{users.filter(u => u.isAdmin).length}</span>
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="products">
        <TabsList className="mb-6">
          <TabsTrigger value="products">商品管理</TabsTrigger>
          <TabsTrigger value="users">用户管理</TabsTrigger>
          <TabsTrigger value="orders">订单管理</TabsTrigger>
          <TabsTrigger value="settings">系统设置</TabsTrigger>
        </TabsList>

        <TabsContent value="products" className="mt-0">
          <div className="flex items-center justify-between mb-4">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="搜索商品..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value)
                  setCurrentPage(1)
                }}
              />
            </div>
            <Button asChild>
              <Link href="/admin/products/add">
                <PlusCircle className="mr-2 h-4 w-4" />
                添加商品
              </Link>
            </Button>
          </div>

          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[80px]">图片</TableHead>
                  <TableHead>商品名称</TableHead>
                  <TableHead>分类</TableHead>
                  <TableHead className="text-right">价格</TableHead>
                  <TableHead className="text-center">库存</TableHead>
                  <TableHead className="text-center">状态</TableHead>
                  <TableHead className="text-right">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedProducts.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      <div className="relative w-10 h-10 rounded-md overflow-hidden">
                        <Image
                          src={product.image || "/placeholder.svg"}
                          alt={product.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell>{product.category}</TableCell>
                    <TableCell className="text-right">¥{product.price.toFixed(2)}</TableCell>
                    <TableCell className="text-center">{product.stock}</TableCell>
                    <TableCell className="text-center">
                      <Badge variant={product.stock > 0 ? "outline" : "destructive"}>
                        {product.stock > 0 ? "在售" : "缺货"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <span className="sr-only">打开菜单</span>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="h-4 w-4"
                            >
                              <circle cx="12" cy="12" r="1" />
                              <circle cx="12" cy="5" r="1" />
                              <circle cx="12" cy="19" r="1" />
                            </svg>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>操作</DropdownMenuLabel>
                          <DropdownMenuItem asChild>
                            <Link href={`/admin/products/edit/${product.id}`}>
                              <Edit className="mr-2 h-4 w-4" />
                              编辑
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDeleteProduct(product.id)}>
                            <Trash2 className="mr-2 h-4 w-4" />
                            删除
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}

                {paginatedProducts.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-6">
                      没有找到匹配的商品
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-end space-x-2 mt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
                上一页
              </Button>
              <span className="text-sm">
                第 {currentPage} 页，共 {totalPages} 页
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
              >
                下一页
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          )}
        </TabsContent>

        <TabsContent value="users" className="mt-0">
          <div className="flex items-center justify-between mb-4">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input type="search" placeholder="搜索用户..." className="pl-8" />
            </div>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              添加用户
            </Button>
          </div>

          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>用户ID</TableHead>
                  <TableHead>用户名</TableHead>
                  <TableHead>邮箱</TableHead>
                  <TableHead className="text-center">角色</TableHead>
                  <TableHead className="text-center">注册时间</TableHead>
                  <TableHead className="text-right">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-mono text-sm">{user.id}</TableCell>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell className="text-center">
                      <Badge variant={user.isAdmin ? "default" : "outline"}>
                        {user.isAdmin ? "管理员" : "普通用户"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" onClick={() => toggleAdmin(user.id)}>
                        {user.isAdmin ? "取消管理员" : "设为管理员"}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="orders" className="mt-0">
          <div className="flex items-center justify-between mb-4">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input type="search" placeholder="搜索订单..." className="pl-8" />
            </div>
          </div>

          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>订单ID</TableHead>
                  <TableHead>用户</TableHead>
                  <TableHead className="text-center">商品数</TableHead>
                  <TableHead className="text-right">总金额</TableHead>
                  <TableHead className="text-center">状态</TableHead>
                  <TableHead className="text-center">下单时间</TableHead>
                  <TableHead className="text-right">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-mono text-sm">{order.id}</TableCell>
                    <TableCell className="font-medium">{order.user?.name || "未知用户"}</TableCell>
                    <TableCell className="text-center">{order.items?.length || 0}</TableCell>
                    <TableCell className="text-right">¥{order.totalAmount.toFixed(2)}</TableCell>
                    <TableCell className="text-center">
                      <Badge
                        variant={
                          order.status === "pending"
                            ? "outline"
                            : order.status === "processing"
                            ? "secondary"
                            : order.status === "shipped"
                            ? "default"
                            : order.status === "delivered"
                            ? "default"
                            : "destructive"
                        }
                      >
                        {
                          {
                            pending: "待处理",
                            processing: "处理中",
                            shipped: "已发货",
                            delivered: "已送达",
                            cancelled: "已取消"
                          }[order.status] || order.status
                        }
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <span className="sr-only">打开菜单</span>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="h-4 w-4"
                            >
                              <circle cx="12" cy="12" r="1" />
                              <circle cx="12" cy="5" r="1" />
                              <circle cx="12" cy="19" r="1" />
                            </svg>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>操作</DropdownMenuLabel>
                          <DropdownMenuItem>查看详情</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>更新状态</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="settings" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle>系统设置</CardTitle>
              <CardDescription>管理网站的基本设置和配置</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="site-name">网站名称</Label>
                <Input id="site-name" defaultValue="EasyShop - 简易电商平台" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="site-description">网站描述</Label>
                <Input id="site-description" defaultValue="现代化电商商品展示平台" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contact-email">联系邮箱</Label>
                <Input id="contact-email" type="email" defaultValue="support@easyshop.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contact-phone">联系电话</Label>
                <Input id="contact-phone" defaultValue="400-123-4567" />
              </div>
              <Button>保存设置</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
