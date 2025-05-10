"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { ChevronLeft, CreditCard, Truck, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { useCart } from "@/lib/hooks/use-cart"
import { useAuth } from "@/lib/hooks/use-auth"
import { createOrder } from "@/lib/actions/orders"

export default function CheckoutPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { user } = useAuth()
  const { cartItems, totalPrice, clearCart } = useCart()

  const [loading, setLoading] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState("credit-card")

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
    zipCode: "",
    cardNumber: "",
    cardName: "",
    cardExpiry: "",
    cardCvc: "",
  })

  // 如果用户未登录，重定向到登录页面
  useEffect(() => {
    if (!user) {
      router.push("/login?redirect=/checkout")
    }
  }, [user, router])

  // 如果购物车为空，重定向到购物车页面
  useEffect(() => {
    if (cartItems.length === 0) {
      router.push("/cart")
    }
  }, [cartItems, router])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // 根据接口要求创建订单数据
      const orderData = {
        // 收货地址信息
        shippingAddress: {
          name: formData.name || "未提供",
          phone: formData.phone || "未提供",
          address: formData.address || "未提供",
          city: formData.city || "未提供",
          province: "未提供", // 提供一个默认值
          postalCode: formData.zipCode || "未提供"
        },
        // 支付方式
        paymentMethod: paymentMethod || "credit-card",
        // 提交包含商品信息的数组（虽然接口文档未要求，但为确保数据完整）
        items: cartItems.map(item => ({
          productId: item.product.id,
          quantity: item.quantity
        })),
        // 总金额（虽然接口文档未要求，但为确保数据完整）
        totalAmount: totalPrice + (totalPrice >= 99 ? 0 : 10)
      }

      // 调用创建订单API
      const result = await createOrder(orderData)
      
      toast({
        title: "订单提交成功",
        description: "您的订单已成功提交，我们将尽快为您发货。",
      })
      
      clearCart()
      router.push("/orders/success")
    } catch (error: any) {
      console.error("订单提交失败:", error)
      toast({
        title: "订单提交失败",
        description: error.data?.message || "创建订单失败，请稍后再试",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  if (!user || cartItems.length === 0) {
    return null // 等待重定向
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6">
        <Link href="/cart" className="flex items-center text-muted-foreground hover:text-primary">
          <ChevronLeft className="h-4 w-4 mr-1" />
          返回购物车
        </Link>
      </div>

      <h1 className="text-2xl font-bold mb-6">结算</h1>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit}>
            <Card className="mb-6">
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 mb-4">
                  <MapPin className="h-5 w-5 text-primary" />
                  <h2 className="text-lg font-medium">收货信息</h2>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">收货人姓名</Label>
                    <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">联系电话</Label>
                    <Input id="phone" name="phone" value={formData.phone} onChange={handleChange} required />
                  </div>

                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="address">详细地址</Label>
                    <Textarea id="address" name="address" value={formData.address} onChange={handleChange} required />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="city">城市</Label>
                    <Input id="city" name="city" value={formData.city} onChange={handleChange} required />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="zipCode">邮政编码</Label>
                    <Input id="zipCode" name="zipCode" value={formData.zipCode} onChange={handleChange} required />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="mb-6">
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 mb-4">
                  <Truck className="h-5 w-5 text-primary" />
                  <h2 className="text-lg font-medium">配送方式</h2>
                </div>

                <RadioGroup defaultValue="standard">
                  <div className="flex items-center space-x-2 mb-2">
                    <RadioGroupItem value="standard" id="standard" />
                    <Label htmlFor="standard">标准配送 (3-5个工作日)</Label>
                    <span className="ml-auto">免费</span>
                  </div>

                  <div className="flex items-center space-x-2 mb-2">
                    <RadioGroupItem value="express" id="express" />
                    <Label htmlFor="express">快速配送 (1-2个工作日)</Label>
                    <span className="ml-auto">¥15.00</span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="same-day" id="same-day" />
                    <Label htmlFor="same-day">当日达 (限部分地区)</Label>
                    <span className="ml-auto">¥30.00</span>
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>

            <Card className="mb-6">
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 mb-4">
                  <CreditCard className="h-5 w-5 text-primary" />
                  <h2 className="text-lg font-medium">支付方式</h2>
                </div>

                <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                  <div className="flex items-center space-x-2 mb-2">
                    <RadioGroupItem value="credit-card" id="credit-card" />
                    <Label htmlFor="credit-card">信用卡支付</Label>
                  </div>

                  <div className="flex items-center space-x-2 mb-2">
                    <RadioGroupItem value="alipay" id="alipay" />
                    <Label htmlFor="alipay">支付宝</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="wechat" id="wechat" />
                    <Label htmlFor="wechat">微信支付</Label>
                  </div>
                </RadioGroup>

                {paymentMethod === "credit-card" && (
                  <div className="mt-4 grid gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="cardNumber">卡号</Label>
                      <Input
                        id="cardNumber"
                        name="cardNumber"
                        placeholder="1234 5678 9012 3456"
                        value={formData.cardNumber}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="cardName">持卡人姓名</Label>
                      <Input id="cardName" name="cardName" value={formData.cardName} onChange={handleChange} />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="cardExpiry">有效期</Label>
                        <Input
                          id="cardExpiry"
                          name="cardExpiry"
                          placeholder="MM/YY"
                          value={formData.cardExpiry}
                          onChange={handleChange}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="cardCvc">安全码</Label>
                        <Input
                          id="cardCvc"
                          name="cardCvc"
                          placeholder="CVC"
                          value={formData.cardCvc}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="lg:hidden">
              <Button type="submit" className="w-full" size="lg" disabled={loading}>
                {loading ? "处理中..." : `提交订单 - ¥${(totalPrice + (totalPrice >= 99 ? 0 : 10)).toFixed(2)}`}
              </Button>
            </div>
          </form>
        </div>

        <div>
          <Card className="sticky top-20">
            <CardContent className="pt-6">
              <h2 className="text-lg font-medium mb-4">订单摘要</h2>

              <div className="space-y-4 mb-4">
                {cartItems.map((item) => (
                  <div key={item.product.id} className="flex gap-3">
                    <div className="relative w-16 h-16 rounded-md overflow-hidden flex-shrink-0">
                      <Image
                        src={item.product.image || "/placeholder.svg"}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium line-clamp-1">{item.product.name}</p>
                      <p className="text-sm text-muted-foreground">数量: {item.quantity}</p>
                      <p className="text-sm">¥{(item.product.price * item.quantity).toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>

              <Separator className="my-4" />

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">商品总价</span>
                  <span>¥{totalPrice.toFixed(2)}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-muted-foreground">运费</span>
                  <span>{totalPrice >= 99 ? "免运费" : "¥10.00"}</span>
                </div>

                <Separator className="my-2" />

                <div className="flex justify-between font-medium text-lg">
                  <span>总计</span>
                  <span>¥{(totalPrice + (totalPrice >= 99 ? 0 : 10)).toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full" size="lg" disabled={loading} onClick={handleSubmit}>
                {loading ? "处理中..." : "提交订单"}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}
