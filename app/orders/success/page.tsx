import Link from "next/link"
import { CheckCircle, Package } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function OrderSuccessPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-md mx-auto text-center">
        <div className="flex justify-center mb-4">
          <CheckCircle className="h-16 w-16 text-green-500" />
        </div>

        <h1 className="text-2xl font-bold mb-4">订单提交成功！</h1>

        <div className="bg-muted p-6 rounded-lg mb-6">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Package className="h-5 w-5 text-primary" />
            <p className="font-medium">订单号: ORD-{Math.floor(Math.random() * 1000000)}</p>
          </div>
          <p className="text-muted-foreground">
            我们已收到您的订单，将尽快为您安排发货。您可以在"我的订单"中查看订单状态。
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild>
            <Link href="/products">继续购物</Link>
          </Button>

          <Button variant="outline" asChild>
            <Link href="/orders">查看我的订单</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
