"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

const slides = [
  {
    id: 1,
    title: "新品上市",
    description: "探索我们的最新产品系列，享受限时折扣",
    image: "/placeholder.svg?height=600&width=1200",
    cta: "立即购买",
    url: "/products/new",
  },
  {
    id: 2,
    title: "夏季特惠",
    description: "全场商品低至5折，还有更多惊喜等你发现",
    image: "/placeholder.svg?height=600&width=1200",
    cta: "查看优惠",
    url: "/promotions",
  },
  {
    id: 3,
    title: "会员专享",
    description: "注册成为会员，享受专属优惠和服务",
    image: "/placeholder.svg?height=600&width=1200",
    cta: "加入会员",
    url: "/membership",
  },
]

export default function HeroCarousel() {
  const [current, setCurrent] = useState(0)

  const prev = () => setCurrent((current) => (current === 0 ? slides.length - 1 : current - 1))
  const next = () => setCurrent((current) => (current === slides.length - 1 ? 0 : current + 1))

  useEffect(() => {
    const interval = setInterval(next, 5000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="relative overflow-hidden rounded-xl">
      <div
        className="flex transition-transform duration-500 ease-out"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {slides.map((slide) => (
          <div key={slide.id} className="min-w-full relative">
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/20 z-10 rounded-xl" />
            <Image
              src={slide.image || "/placeholder.svg"}
              alt={slide.title}
              width={1200}
              height={600}
              className="w-full aspect-[21/9] object-cover rounded-xl"
              priority
            />
            <div className="absolute inset-0 flex flex-col justify-center z-20 p-6 md:p-12 text-white">
              <h2 className="text-3xl md:text-5xl font-bold mb-4">{slide.title}</h2>
              <p className="text-lg md:text-xl mb-6 max-w-md">{slide.description}</p>
              <div>
                <Button size="lg" asChild>
                  <a href={slide.url}>{slide.cta}</a>
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Button
        variant="ghost"
        size="icon"
        className="absolute left-2 top-1/2 -translate-y-1/2 z-30 bg-black/30 text-white hover:bg-black/50 rounded-full"
        onClick={prev}
      >
        <ChevronLeft className="h-6 w-6" />
        <span className="sr-only">上一张</span>
      </Button>

      <Button
        variant="ghost"
        size="icon"
        className="absolute right-2 top-1/2 -translate-y-1/2 z-30 bg-black/30 text-white hover:bg-black/50 rounded-full"
        onClick={next}
      >
        <ChevronRight className="h-6 w-6" />
        <span className="sr-only">下一张</span>
      </Button>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 flex gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            className={cn("w-2.5 h-2.5 rounded-full transition-colors", current === index ? "bg-white" : "bg-white/50")}
            onClick={() => setCurrent(index)}
          >
            <span className="sr-only">Slide {index + 1}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
