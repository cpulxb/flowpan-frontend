"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Camera, Loader2 } from "lucide-react"
import { toast } from "sonner"

interface SettingsModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function SettingsModal({ open, onOpenChange }: SettingsModalProps) {
  const [passwordLoading, setPasswordLoading] = useState(false)
  const [passwordForm, setPasswordForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error("两次输入的新密码不一致")
      return
    }
    if (passwordForm.newPassword.length < 8 || passwordForm.newPassword.length > 18) {
      toast.error("密码长度需为 8-18 位")
      return
    }
    setPasswordLoading(true)
    await new Promise(r => setTimeout(r, 1000))
    setPasswordLoading(false)
    toast.success("密码修改成功")
    setPasswordForm({ oldPassword: "", newPassword: "", confirmPassword: "" })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>个人设置</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="avatar" className="mt-2">
          <TabsList className="w-full">
            <TabsTrigger value="avatar" className="flex-1">修改头像</TabsTrigger>
            <TabsTrigger value="password" className="flex-1">修改密码</TabsTrigger>
          </TabsList>

          <TabsContent value="avatar" className="mt-4">
            <div className="flex flex-col items-center gap-6 py-4">
              <Avatar className="h-24 w-24">
                <AvatarFallback className="text-2xl bg-primary text-primary-foreground">U</AvatarFallback>
              </Avatar>
              <Button
                variant="outline"
                onClick={() => {
                  toast.success("头像上传成功（演示）")
                }}
              >
                <Camera className="mr-2 h-4 w-4" />
                选择图片
              </Button>
              <p className="text-xs text-muted-foreground">选择后自动上传，支持 JPG、PNG 格式</p>
            </div>
          </TabsContent>

          <TabsContent value="password" className="mt-4">
            <form onSubmit={handleChangePassword} className="space-y-4">
              <div className="space-y-2">
                <Label className="text-foreground">旧密码</Label>
                <Input
                  type="password"
                  placeholder="请输入旧密码"
                  value={passwordForm.oldPassword}
                  onChange={e => setPasswordForm(p => ({ ...p, oldPassword: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-foreground">新密码</Label>
                <Input
                  type="password"
                  placeholder="请输入新密码（8-18位）"
                  value={passwordForm.newPassword}
                  onChange={e => setPasswordForm(p => ({ ...p, newPassword: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-foreground">确认新密码</Label>
                <Input
                  type="password"
                  placeholder="请再次输入新密码"
                  value={passwordForm.confirmPassword}
                  onChange={e => setPasswordForm(p => ({ ...p, confirmPassword: e.target.value }))}
                />
              </div>
              <Button type="submit" className="w-full" disabled={passwordLoading}>
                {passwordLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                修改密码
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
