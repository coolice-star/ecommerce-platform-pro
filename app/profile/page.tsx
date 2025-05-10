"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/lib/hooks/use-auth"
import { useToast } from "@/components/ui/use-toast"
import { Link } from "@/components/ui/link"

export default function ProfilePage() {
  const router = useRouter()
  const { user, logout } = useAuth()
  const { toast } = useToast()

  const [profileForm, setProfileForm] = useState({
    name: "",
    email: "",
    phone: "",
  })

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  const [loading, setLoading] = useState(false)

  // 如果用户未登录，重定向到登录页面
  useEffect(() => {
    if (!user) {
      router.push("/login?redirect=/profile")
    } else {
      // 填充表单数据
      setProfileForm({
        name: user.name,
        email: user.email,
        phone: "",
      })
    }
  }, [user, router])

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // 模拟API调用
    setTimeout(() => {
      toast({
        title: "个人资料已更新",
        description: "您的个人资料已成功更新。",
      })
      setLoading(false)
    }, 1000)
  }

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast({
        title: "密码不匹配",
        description: "新密码和确认密码不一致，请重新输入。",
        variant: "destructive",
      })
      return
    }

    setLoading(true)

    // 模拟API调用
    setTimeout(() => {
      toast({
        title: "密码已更新",
        description: "您的密码已成功更新。",
      })
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      })
      setLoading(false)
    }, 1000)
  }

  if (!user) {
    return null // 等待重定向
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-6">个人中心</h1>

      <div className="grid md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <Tabs defaultValue="profile">
            <TabsList className="grid grid-cols-2 w-full">
              <TabsTrigger value="profile">个人资料</TabsTrigger>
              <TabsTrigger value="password">修改密码</TabsTrigger>
            </TabsList>

            <TabsContent value="profile">
              <form onSubmit={handleProfileSubmit}>
                <CardHeader>
                  <CardTitle>个人资料</CardTitle>
                  <CardDescription>更新您的个人信息</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">姓名</Label>
                    <Input
                      id="name"
                      value={profileForm.name}
                      onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">邮箱</Label>
                    <Input
                      id="email"
                      type="email"
                      value={profileForm.email}
                      onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                      disabled
                    />
                    <p className="text-xs text-muted-foreground">邮箱地址不可修改</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">手机号码</Label>
                    <Input
                      id="phone"
                      value={profileForm.phone}
                      onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button type="submit" disabled={loading}>
                    {loading ? "保存中..." : "保存修改"}
                  </Button>
                </CardFooter>
              </form>
            </TabsContent>

            <TabsContent value="password">
              <form onSubmit={handlePasswordSubmit}>
                <CardHeader>
                  <CardTitle>修改密码</CardTitle>
                  <CardDescription>更新您的账户密码</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="current-password">当前密码</Label>
                    <Input
                      id="current-password"
                      type="password"
                      value={passwordForm.currentPassword}
                      onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="new-password">新密码</Label>
                    <Input
                      id="new-password"
                      type="password"
                      value={passwordForm.newPassword}
                      onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">确认新密码</Label>
                    <Input
                      id="confirm-password"
                      type="password"
                      value={passwordForm.confirmPassword}
                      onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button type="submit" disabled={loading}>
                    {loading ? "更新中..." : "更新密码"}
                  </Button>
                </CardFooter>
              </form>
            </TabsContent>
          </Tabs>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>账户信息</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">账户类型</span>
                  <span>{user.isAdmin ? "管理员" : "普通用户"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">注册时间</span>
                  <span>2023-05-15</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">上次登录</span>
                  <span>今天</span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full" onClick={logout}>
                退出登录
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>快速访问</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="ghost" className="w-full justify-start" asChild>
                <Link href="/orders">我的订单</Link>
              </Button>
              <Button variant="ghost" className="w-full justify-start" asChild>
                <Link href="/wishlist">我的收藏</Link>
              </Button>
              {user.isAdmin && (
                <Button variant="ghost" className="w-full justify-start" asChild>
                  <Link href="/admin">管理后台</Link>
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
