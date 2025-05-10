import * as React from "react"
import { cn } from "@/lib/utils"
import NextLink from "next/link"

interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string
  children: React.ReactNode
  className?: string
}

export const Link = React.forwardRef<HTMLAnchorElement, LinkProps>(
  ({ className, href, children, ...props }, ref) => {
    return (
      <NextLink 
        href={href} 
        ref={ref} 
        className={cn(
          "text-primary underline-offset-4 hover:underline",
          className
        )}
        {...props}
      >
        {children}
      </NextLink>
    )
  }
)

Link.displayName = "Link" 