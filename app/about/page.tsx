import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { ShoppingBag, Truck, CreditCard, LifeBuoy } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center">关于我们</h1>

        <div className="mb-12">
          <Image
            src="/placeholder.svg?height=400&width=800"
            alt="关于我们"
            width={800}
            height={400}
            className="w-full rounded-lg mb-6"
          />

          <h2 className="text-2xl font-semibold mb-4">我们的故事</h2>
          <p className="text-muted-foreground mb-4">
            EasyShop成立于2023年，是一家致力于为消费者提供优质商品和卓越购物体验的电商平台。我们的使命是通过技术创新和优质服务，让购物变得更加简单、愉悦和高效。
          </p>
          <p className="text-muted-foreground mb-4">
            从创立之初，我们就坚持以客户为中心，不断优化产品质量和服务流程，努力成为消费者信赖的购物平台。经过不断发展，我们已经拥有了丰富的商品类别和庞大的用户群体。
          </p>
        </div>

        <div className="mb-12">
          <h2 className="text-2xl font-semibold mb-6 text-center">我们的优势</h2>

          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardContent className="p-6 flex items-start gap-4">
                <div className="bg-primary/10 p-3 rounded-full">
                  <ShoppingBag className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium mb-2">丰富的商品选择</h3>
                  <p className="text-sm text-muted-foreground">
                    我们提供各类优质商品，从电子产品到日常用品，满足您的各种需求。
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 flex items-start gap-4">
                <div className="bg-primary/10 p-3 rounded-full">
                  <Truck className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium mb-2">快速配送</h3>
                  <p className="text-sm text-muted-foreground">
                    我们与多家物流公司合作，确保您的订单能够快速、安全地送达。
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 flex items-start gap-4">
                <div className="bg-primary/10 p-3 rounded-full">
                  <CreditCard className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium mb-2">安全支付</h3>
                  <p className="text-sm text-muted-foreground">
                    我们采用先进的加密技术，保护您的支付信息和个人数据安全。
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 flex items-start gap-4">
                <div className="bg-primary/10 p-3 rounded-full">
                  <LifeBuoy className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium mb-2">优质客服</h3>
                  <p className="text-sm text-muted-foreground">
                    我们的客服团队随时为您提供帮助，解决您在购物过程中遇到的问题。
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">我们的愿景</h2>
          <p className="text-muted-foreground mb-4">
            我们的愿景是成为最受消费者信赖的电商平台，通过不断创新和优化，为用户提供更好的购物体验。我们相信，只有真正理解并满足消费者需求，才能在激烈的市场竞争中脱颖而出。
          </p>
          <p className="text-muted-foreground">
            未来，我们将继续扩大商品种类，优化用户界面，提升物流效率，为消费者创造更多价值。同时，我们也将积极履行社会责任，推动行业健康发展。
          </p>
        </div>
      </div>
    </div>
  )
}
