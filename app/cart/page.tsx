"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ChevronLeft, Trash2, ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { useCart } from "@/lib/hooks/use-cart"
import { useAuth } from "@/lib/hooks/use-auth"

export default function CartPage() {
  const { cartItems, removeFromCart, updateQuantity, totalItems, totalPrice, clearCart } = useCart()
  const { user } = useAuth()
  const [couponCode, setCouponCode] = useState("")

  const handleQuantityChange = (productId: string, quantity: number) => {
    updateQuantity(productId, quantity)
  }

  const handleRemoveItem = (productId: string) => {
    removeFromCart(productId)
  }

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <div className="max-w-md mx-auto">
          <ShoppingBag className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
          <h1 className="text-2xl font-bold mb-4">购物车为空</h1>
          <p className="text-muted-foreground mb-6">您的购物车中还没有商品，快去选购吧！</p>
          <Button asChild>
            <Link href="/products">浏览商品</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6">
        <Link href="/products" className="flex items-center text-muted-foreground hover:text-primary">
          <ChevronLeft className="h-4 w-4 mr-1" />
          继续购物
        </Link>
      </div>

      <h1 className="text-2xl font-bold mb-6">购物车 ({totalItems} 件商品)</h1>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="border rounded-lg overflow-hidden">
            <div className="grid grid-cols-12 bg-muted/50 p-4 text-sm font-medium">
              <div className="col-span-6">商品</div>
              <div className="col-span-2 text-center">单价</div>
              <div className="col-span-2 text-center">数量</div>
              <div className="col-span-2 text-center">小计</div>
            </div>

            {cartItems.map((item) => (
              <div key={item.product.id} className="grid grid-cols-12 p-4 items-center border-t">
                <div className="col-span-6">
                  <div className="flex items-center gap-4">
                    <div className="relative w-16 h-16 rounded-md overflow-hidden flex-shrink-0">
                      <Image
                        src={item.product.image || "/placeholder.svg"}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <Link href={`/products/${item.product.id}`} className="font-medium hover:text-primary">
                        {item.product.name}
                      </Link>
                      <div className="text-sm text-muted-foreground mt-1">{item.product.category}</div>
                    </div>
                  </div>
                </div>

                <div className="col-span-2 text-center">¥{item.product.price.toFixed(2)}</div>

                <div className="col-span-2 text-center">
                  <div className="flex items-center justify-center">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handleQuantityChange(item.product.id, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                    >
                      -
                    </Button>
                    <Input
                      type="number"
                      min="1"
                      max={item.product.stock}
                      value={item.quantity}
                      onChange={(e) => handleQuantityChange(item.product.id, Number.parseInt(e.target.value) || 1)}
                      className="w-12 h-8 text-center mx-1"
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handleQuantityChange(item.product.id, item.quantity + 1)}
                      disabled={item.quantity >= item.product.stock}
                    >
                      +
                    </Button>
                  </div>
                </div>

                <div className="col-span-2 text-center">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">¥{(item.product.price * item.quantity).toFixed(2)}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveItem(item.product.id)}
                      className="h-8 w-8 text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">删除</span>
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-between mt-4">
            <Button variant="outline" onClick={clearCart}>
              清空购物车
            </Button>
          </div>
        </div>

        <div>
          <Card>
            <CardContent className="pt-6">
              <h2 className="text-lg font-medium mb-4">订单摘要</h2>

              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">商品总价</span>
                  <span>¥{totalPrice.toFixed(2)}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-muted-foreground">运费</span>
                  <span>{totalPrice >= 99 ? "免运费" : "¥10.00"}</span>
                </div>

                <div className="flex items-center gap-2">
                  <Input placeholder="输入优惠码" value={couponCode} onChange={(e) => setCouponCode(e.target.value)} />
                  <Button variant="outline">应用</Button>
                </div>

                <Separator />

                <div className="flex justify-between font-medium text-lg">
                  <span>总计</span>
                  <span>¥{(totalPrice + (totalPrice >= 99 ? 0 : 10)).toFixed(2)}</span>
                </div>
              </div>
            </CardContent>

            <CardFooter className="flex flex-col">
              <Button className="w-full mb-2" size="lg" asChild>
                <Link href={user ? "/checkout" : "/login?redirect=/checkout"}>结算</Link>
              </Button>
              <p className="text-xs text-center text-muted-foreground">
                继续操作即表示您同意我们的
                <Link href="/terms" className="underline">
                  条款
                </Link>
                和
                <Link href="/privacy" className="underline">
                  隐私政策
                </Link>
              </p>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}
