"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/lib/hooks/use-auth"
import { Checkbox } from "@/components/ui/checkbox"

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirect = searchParams.get("redirect") || "/"
  const { login, register } = useAuth()

  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
    isAdmin: false,
  })

  const [registerForm, setRegisterForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const success = await login(loginForm.email, loginForm.password, loginForm.isAdmin)
      if (success) {
        router.push(loginForm.isAdmin ? "/admin" : redirect)
      } else {
        setError("邮箱或密码错误")
      }
    } catch (err) {
      setError("登录失败，请稍后再试")
    } finally {
      setLoading(false)
    }
  }

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (registerForm.password !== registerForm.confirmPassword) {
      setError("两次输入的密码不一致")
      return
    }

    setLoading(true)

    try {
      const success = await register(registerForm.name, registerForm.email, registerForm.password)
      if (success) {
        router.push(redirect)
      } else {
        setError("注册失败，该邮箱可能已被使用")
      }
    } catch (err) {
      setError("注册失败，请稍后再试")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-md mx-auto">
        <div className="flex justify-center mb-6">
          <Link href="/" className="flex items-center gap-2">
            <ShoppingBag className="h-8 w-8" />
            <span className="text-2xl font-bold">EasyShop</span>
          </Link>
        </div>

        <div className="border rounded-lg p-6">
          <Tabs defaultValue="login">
            <TabsList className="grid grid-cols-2 mb-6">
              <TabsTrigger value="login">登录</TabsTrigger>
              <TabsTrigger value="register">注册</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">邮箱</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    value={loginForm.email}
                    onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">密码</Label>
                    <Link href="/forgot-password" className="text-sm text-primary hover:underline">
                      忘记密码?
                    </Link>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={loginForm.password}
                    onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                    required
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="admin-login"
                    checked={loginForm.isAdmin}
                    onCheckedChange={(checked) => setLoginForm({ ...loginForm, isAdmin: checked as boolean })}
                  />
                  <Label htmlFor="admin-login">以管理员身份登录</Label>
                </div>

                {error && <div className="text-sm text-destructive">{error}</div>}

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "登录中..." : "登录"}
                </Button>

                <div className="text-center text-sm text-muted-foreground">
                  <span>测试账号: admin@example.com (管理员) 或 zhangsan@example.com (普通用户)</span>
                  <br />
                  <span>密码: 任意输入即可</span>
                </div>
              </form>
            </TabsContent>

            <TabsContent value="register">
              <form onSubmit={handleRegisterSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">姓名</Label>
                  <Input
                    id="name"
                    placeholder="张三"
                    value={registerForm.name}
                    onChange={(e) => setRegisterForm({ ...registerForm, name: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="register-email">邮箱</Label>
                  <Input
                    id="register-email"
                    type="email"
                    placeholder="your@email.com"
                    value={registerForm.email}
                    onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="register-password">密码</Label>
                  <Input
                    id="register-password"
                    type="password"
                    placeholder="••••••••"
                    value={registerForm.password}
                    onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirm-password">确认密码</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    placeholder="••••••••"
                    value={registerForm.confirmPassword}
                    onChange={(e) => setRegisterForm({ ...registerForm, confirmPassword: e.target.value })}
                    required
                  />
                </div>

                {error && <div className="text-sm text-destructive">{error}</div>}

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "注册中..." : "注册"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </div>

        <div className="text-center mt-6 text-sm text-muted-foreground">
          <p>
            继续操作即表示您同意我们的
            <Link href="/terms" className="text-primary hover:underline mx-1">
              条款
            </Link>
            和
            <Link href="/privacy" className="text-primary hover:underline mx-1">
              隐私政策
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
