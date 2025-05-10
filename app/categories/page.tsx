import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { categories } from "@/lib/data"

export default function CategoriesPage() {
  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-6">商品分类</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {categories.map((category) => (
          <Link key={category.id} href={`/products?category=${category.slug}`}>
            <Card className="hover:shadow-md transition-shadow h-full">
              <CardContent className="p-6 flex flex-col items-center justify-center text-center">
                <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-4">
                  {category.icon}
                </div>
                <h3 className="text-lg font-medium">{category.name}</h3>
                <p className="text-muted-foreground mt-2">浏览所有{category.name}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
