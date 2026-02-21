"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import {
  Settings,
  Save,
  Search,
  ChevronLeft,
  ChevronRight,
  Loader2,
  HardDrive,
} from "lucide-react"
import { mockUsers, formatFileSize, type UserItem } from "@/lib/mock-data"
import { toast } from "sonner"

export default function AdminPage() {
  return (
    <div className="flex flex-col h-full">
      <div className="px-4 md:px-6 pt-4 pb-2">
        <h1 className="text-xl font-bold text-foreground flex items-center gap-2">
          <Settings className="h-5 w-5" />
          管理后台
        </h1>
      </div>

      <div className="px-4 md:px-6 flex-1 overflow-auto pb-6">
        <Tabs defaultValue="system" className="w-full">
          <TabsList>
            <TabsTrigger value="system">系统设置</TabsTrigger>
            <TabsTrigger value="users">用户管理</TabsTrigger>
            <TabsTrigger value="files">文件管理</TabsTrigger>
          </TabsList>

          <TabsContent value="system" className="mt-4">
            <SystemSettings />
          </TabsContent>
          <TabsContent value="users" className="mt-4">
            <UserManagement />
          </TabsContent>
          <TabsContent value="files" className="mt-4">
            <FileManagement />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

function SystemSettings() {
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    emailTitle: "FlowPan 邮箱验证码",
    emailContent: "您的验证码为：%s，15分钟内有效",
    initialSpace: "5",
  })

  const handleSave = async () => {
    setLoading(true)
    await new Promise(r => setTimeout(r, 1000))
    setLoading(false)
    toast.success("系统设置保存成功")
  }

  return (
    <div className="max-w-lg space-y-6">
      <div className="space-y-2">
        <Label className="text-foreground">注册邮件标题</Label>
        <Input
          value={form.emailTitle}
          onChange={e => setForm(f => ({ ...f, emailTitle: e.target.value }))}
        />
      </div>
      <div className="space-y-2">
        <Label className="text-foreground">注册邮件内容</Label>
        <Textarea
          value={form.emailContent}
          onChange={e => setForm(f => ({ ...f, emailContent: e.target.value }))}
          rows={4}
        />
        <p className="text-xs text-muted-foreground">{'提示：使用 %s 作为验证码占位符'}</p>
      </div>
      <div className="space-y-2">
        <Label className="text-foreground">用户初始空间 (GB)</Label>
        <Input
          type="number"
          value={form.initialSpace}
          onChange={e => setForm(f => ({ ...f, initialSpace: e.target.value }))}
          className="max-w-[200px]"
        />
      </div>
      <Button onClick={handleSave} disabled={loading}>
        {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
        保存设置
      </Button>
    </div>
  )
}

function UserManagement() {
  const [users] = useState<UserItem[]>(mockUsers)
  const [searchQuery, setSearchQuery] = useState("")
  const [storageModal, setStorageModal] = useState<UserItem | null>(null)
  const [storageAmount, setStorageAmount] = useState("5")
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 10

  const filteredUsers = users.filter(u =>
    u.nickname.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email.toLowerCase().includes(searchQuery.toLowerCase())
  )
  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / pageSize))
  const pagedUsers = filteredUsers.slice((currentPage - 1) * pageSize, currentPage * pageSize)

  return (
    <div className="space-y-4">
      <div className="flex gap-2 max-w-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="搜索邮箱/昵称"
            className="pl-9"
            value={searchQuery}
            onChange={e => { setSearchQuery(e.target.value); setCurrentPage(1) }}
          />
        </div>
      </div>

      <div className="rounded-lg border border-border overflow-hidden overflow-x-auto">
        <div className="flex items-center bg-muted/50 text-sm font-medium text-muted-foreground border-b border-border min-w-[640px]">
          <div className="w-24 py-2.5 px-3">用户ID</div>
          <div className="w-24 py-2.5 px-2">昵称</div>
          <div className="flex-1 py-2.5 px-2">邮箱</div>
          <div className="w-16 py-2.5 px-2 text-center">状态</div>
          <div className="w-20 py-2.5 px-2 text-right">总空间</div>
          <div className="w-36 py-2.5 px-2 text-center">操作</div>
        </div>

        {pagedUsers.map(user => (
          <div key={user.id} className="flex items-center text-sm border-b border-border last:border-b-0 hover:bg-muted/30 transition-colors min-w-[640px]">
            <div className="w-24 py-2.5 px-3 text-muted-foreground font-mono text-xs">{user.id.slice(0, 6)}</div>
            <div className="w-24 py-2.5 px-2 text-foreground font-medium truncate">{user.nickname}</div>
            <div className="flex-1 py-2.5 px-2 text-muted-foreground truncate">{user.email}</div>
            <div className="w-16 py-2.5 px-2 text-center">
              <Badge
                variant={user.status === "active" ? "default" : "destructive"}
                className={user.status === "active" ? "bg-success text-success-foreground" : ""}
              >
                {user.status === "active" ? "正常" : "禁用"}
              </Badge>
            </div>
            <div className="w-20 py-2.5 px-2 text-right text-muted-foreground">{formatFileSize(user.totalSpace)}</div>
            <div className="w-36 py-2.5 px-2 flex items-center justify-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                className="h-7 text-xs"
                onClick={() => toast.success(user.status === "active" ? `已禁用 ${user.nickname}` : `已启用 ${user.nickname}`)}
              >
                {user.status === "active" ? "禁用" : "启用"}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 text-xs"
                onClick={() => {
                  setStorageModal(user)
                  setStorageAmount("5")
                }}
              >
                改空间
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-end">
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="h-7 w-7" disabled={currentPage <= 1} onClick={() => setCurrentPage(p => p - 1)}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          {Array.from({ length: totalPages }, (_, i) => (
            <Button key={i} variant={i + 1 === currentPage ? "default" : "ghost"} size="icon" className="h-7 w-7 text-xs" onClick={() => setCurrentPage(i + 1)}>
              {i + 1}
            </Button>
          ))}
          <Button variant="ghost" size="icon" className="h-7 w-7" disabled={currentPage >= totalPages} onClick={() => setCurrentPage(p => p + 1)}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Storage Modal */}
      <Dialog open={!!storageModal} onOpenChange={() => setStorageModal(null)}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>修改用户空间</DialogTitle>
            <DialogDescription className="sr-only">调整用户存储空间大小</DialogDescription>
          </DialogHeader>
          {storageModal && (
            <div className="space-y-4">
              <div className="text-sm text-foreground">
                <p>用户: {storageModal.nickname} ({storageModal.id.slice(0, 6)})</p>
                <p>当前空间: {formatFileSize(storageModal.totalSpace)}</p>
              </div>
              <div className="space-y-2">
                <Label className="text-foreground">调整空间 (GB)</Label>
                <Input
                  type="number"
                  value={storageAmount}
                  onChange={e => setStorageAmount(e.target.value)}
                  placeholder="正数增加，负数减少"
                />
                <p className="text-xs text-muted-foreground">正数增加，负数减少</p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setStorageModal(null)}>取消</Button>
            <Button onClick={() => {
              toast.success(`已为 ${storageModal?.nickname} 调整 ${storageAmount} GB 空间`)
              setStorageModal(null)
            }}>确定</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function FileManagement() {
  const [searchQuery, setSearchQuery] = useState("")

  const mockAdminFiles = [
    { id: "af1", name: "需求文档.pdf", owner: "张三", size: 2.3 * 1024 * 1024, uploadedAt: "2026-02-20" },
    { id: "af2", name: "演示视频.mp4", owner: "李四", size: 156 * 1024 * 1024, uploadedAt: "2026-02-19" },
    { id: "af3", name: "设计图.png", owner: "王五", size: 1.2 * 1024 * 1024, uploadedAt: "2026-02-18" },
    { id: "af4", name: "源码.zip", owner: "张三", size: 20 * 1024 * 1024, uploadedAt: "2026-02-17" },
    { id: "af5", name: "数据备份.sql", owner: "赵六", size: 45 * 1024 * 1024, uploadedAt: "2026-02-16" },
  ]

  const filteredFiles = mockAdminFiles.filter(f =>
    f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    f.owner.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="space-y-4">
      <div className="flex gap-2 max-w-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="搜索文件名/所有者"
            className="pl-9"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="rounded-lg border border-border overflow-hidden overflow-x-auto">
        <div className="flex items-center bg-muted/50 text-sm font-medium text-muted-foreground border-b border-border min-w-[500px]">
          <div className="flex-1 py-2.5 px-3">文件名</div>
          <div className="w-20 py-2.5 px-2">所有者</div>
          <div className="w-24 py-2.5 px-2 text-right">大小</div>
          <div className="w-28 py-2.5 px-2">上传时间</div>
          <div className="w-20 py-2.5 px-2 text-center">操作</div>
        </div>

        {filteredFiles.map(file => (
          <div key={file.id} className="flex items-center text-sm border-b border-border last:border-b-0 hover:bg-muted/30 transition-colors min-w-[500px]">
            <div className="flex-1 py-2.5 px-3 text-foreground font-medium truncate">{file.name}</div>
            <div className="w-20 py-2.5 px-2 text-muted-foreground">{file.owner}</div>
            <div className="w-24 py-2.5 px-2 text-right text-muted-foreground">{formatFileSize(file.size)}</div>
            <div className="w-28 py-2.5 px-2 text-muted-foreground">{file.uploadedAt}</div>
            <div className="w-20 py-2.5 px-2 text-center">
              <Button
                variant="ghost"
                size="sm"
                className="h-7 text-xs text-destructive hover:text-destructive"
                onClick={() => toast.success(`已删除 ${file.name}`)}
              >
                删除
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
