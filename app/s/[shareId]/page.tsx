"use client"

import { useState } from "react"
import { Cloud, Lock, FileText, Download, ArrowLeft, Folder, Image, Film, Music, Package } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { toast } from "sonner"

// Simulate share states: "verify" | "browsing" | "expired"

interface ShareFileItem {
  id: string
  name: string
  type: "folder" | "doc" | "image" | "video" | "music" | "other"
  size: string | null
}

const mockShareFiles: ShareFileItem[] = [
  { id: "sf1", name: "设计稿", type: "folder", size: null },
  { id: "sf2", name: "需求文档.pdf", type: "doc", size: "2.3 MB" },
  { id: "sf3", name: "设计图.png", type: "image", size: "1.2 MB" },
  { id: "sf4", name: "演示视频.mp4", type: "video", size: "156 MB" },
  { id: "sf5", name: "背景音乐.mp3", type: "music", size: "4.5 MB" },
  { id: "sf6", name: "项目架构说明.docx", type: "doc", size: "856 KB" },
]

function getFileIcon(type: ShareFileItem["type"]) {
  switch (type) {
    case "folder": return Folder
    case "doc": return FileText
    case "image": return Image
    case "video": return Film
    case "music": return Music
    default: return Package
  }
}

function getFileIconColor(type: ShareFileItem["type"]) {
  switch (type) {
    case "folder": return "text-warning"
    case "doc": return "text-primary"
    case "image": return "text-success"
    case "video": return "text-destructive"
    case "music": return "text-[#6c5ce7]"
    default: return "text-muted-foreground"
  }
}

export default function PublicSharePage() {
  const [state, setState] = useState<"verify" | "browsing" | "expired">("verify")
  const [code, setCode] = useState("")
  const [currentPath, setCurrentPath] = useState<string[]>(["根目录"])
  const [loading, setLoading] = useState(false)

  const shareInfo = {
    owner: "张三",
    fileName: "项目文档",
    sharedAt: "2026-02-20",
    expiresAt: "2026-02-27",
  }

  const handleVerify = async () => {
    if (!code.trim()) {
      toast.error("请输入提取码")
      return
    }
    setLoading(true)
    await new Promise(r => setTimeout(r, 800))
    setLoading(false)
    if (code === "expired") {
      setState("expired")
    } else {
      setState("browsing")
      toast.success("验证成功")
    }
  }

  const handleDownload = (file: ShareFileItem) => {
    toast.success(`开始下载 ${file.name}`)
  }

  const handleSaveToDisk = (file: ShareFileItem) => {
    toast.info(`保存 ${file.name} 到网盘需要先登录`)
  }

  const handleFolderClick = (folder: ShareFileItem) => {
    setCurrentPath(prev => [...prev, folder.name])
  }

  // Verify Screen
  if (state === "verify") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-4">
        <div className="w-full max-w-sm space-y-6">
          {/* Header */}
          <div className="flex flex-col items-center gap-3">
            <Link href="/login" className="flex items-center gap-2 text-primary">
              <Cloud className="h-7 w-7" />
              <span className="text-xl font-bold tracking-tight">FlowPan</span>
            </Link>
          </div>

          {/* Share Card */}
          <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
            <div className="flex flex-col items-center gap-4">
              {/* Owner */}
              <Avatar className="h-12 w-12">
                <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                  {shareInfo.owner[0]}
                </AvatarFallback>
              </Avatar>
              <p className="text-sm font-medium text-card-foreground">{shareInfo.owner}</p>

              {/* File Info */}
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <FileText className="h-4 w-4" />
                <span>{shareInfo.fileName}</span>
              </div>
              <div className="text-xs text-muted-foreground">
                {"分享于 " + shareInfo.sharedAt + " | 有效期至 " + shareInfo.expiresAt}
              </div>

              {/* Code Input */}
              <div className="w-full space-y-3 pt-2">
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="请输入提取码"
                    className="pl-9 text-center"
                    value={code}
                    onChange={e => setCode(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && handleVerify()}
                    maxLength={8}
                  />
                </div>
                <Button className="w-full" onClick={handleVerify} disabled={loading}>
                  {loading ? "验证中..." : "验证"}
                </Button>
              </div>
            </div>
          </div>

          <p className="text-center text-xs text-muted-foreground">
            {"输入任意提取码进入浏览，输入 \"expired\" 查看失效页面"}
          </p>
        </div>
      </div>
    )
  }

  // Expired Screen
  if (state === "expired") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-4">
        <div className="w-full max-w-sm">
          <div className="rounded-xl border border-border bg-card p-8 shadow-sm text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
              <Lock className="h-7 w-7 text-muted-foreground" />
            </div>
            <h2 className="text-lg font-semibold text-card-foreground">分享已失效</h2>
            <p className="mt-2 text-sm text-muted-foreground">该分享链接已过期或不存在</p>
            <Button className="mt-6" asChild>
              <Link href="/login">返回首页</Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // Browsing Screen
  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Top Bar */}
      <header className="sticky top-0 z-10 flex items-center gap-3 border-b border-border bg-card px-4 py-3 md:px-6">
        <Link href="/login" className="flex items-center gap-2 text-primary shrink-0">
          <Cloud className="h-5 w-5" />
          <span className="text-base font-bold tracking-tight hidden sm:inline">FlowPan</span>
        </Link>
        <div className="mx-3 h-5 w-px bg-border hidden sm:block" />
        <div className="flex items-center gap-2 text-sm text-muted-foreground truncate">
          <Avatar className="h-6 w-6 shrink-0">
            <AvatarFallback className="text-xs bg-primary/10 text-primary">{shareInfo.owner[0]}</AvatarFallback>
          </Avatar>
          <span className="font-medium text-card-foreground">{shareInfo.owner}</span>
          <span className="hidden sm:inline">{"/"}</span>
          <FileText className="h-3.5 w-3.5 hidden sm:block" />
          <span className="hidden sm:inline">{shareInfo.fileName}</span>
          <span className="hidden sm:inline">{"/"}</span>
          <span className="hidden sm:inline">{"有效期至 " + shareInfo.expiresAt}</span>
        </div>
      </header>

      {/* Breadcrumb */}
      <div className="border-b border-border bg-card px-4 py-2 md:px-6">
        <nav className="flex items-center gap-1 text-sm">
          {currentPath.map((segment, index) => (
            <span key={index} className="flex items-center gap-1">
              {index > 0 && <span className="text-muted-foreground mx-1">{">"}</span>}
              <button
                className={`hover:text-primary transition-colors ${
                  index === currentPath.length - 1
                    ? "text-foreground font-medium"
                    : "text-muted-foreground"
                }`}
                onClick={() => setCurrentPath(prev => prev.slice(0, index + 1))}
              >
                {segment}
              </button>
            </span>
          ))}
        </nav>
      </div>

      {/* File List */}
      <main className="flex-1 px-4 py-4 md:px-6">
        {currentPath.length > 1 && (
          <button
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-3 transition-colors"
            onClick={() => setCurrentPath(prev => prev.slice(0, -1))}
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            返回上级
          </button>
        )}

        {/* Desktop Table */}
        <div className="hidden md:block rounded-lg border border-border overflow-hidden">
          <div className="flex items-center bg-muted/50 text-sm font-medium text-muted-foreground border-b border-border">
            <div className="flex-1 py-2.5 px-4">文件名</div>
            <div className="w-24 py-2.5 px-3 text-right">大小</div>
            <div className="w-52 py-2.5 px-3 text-center">操作</div>
          </div>

          {mockShareFiles.map(file => {
            const Icon = getFileIcon(file.type)
            const iconColor = getFileIconColor(file.type)
            return (
              <div
                key={file.id}
                className="flex items-center text-sm border-b border-border last:border-b-0 hover:bg-muted/30 transition-colors"
              >
                <div className="flex-1 py-2.5 px-4 flex items-center gap-2.5 min-w-0">
                  <Icon className={`h-[18px] w-[18px] shrink-0 ${iconColor}`} />
                  {file.type === "folder" ? (
                    <button
                      className="text-foreground font-medium hover:text-primary transition-colors truncate text-left"
                      onClick={() => handleFolderClick(file)}
                    >
                      {file.name}
                    </button>
                  ) : (
                    <span className="text-foreground font-medium truncate">{file.name}</span>
                  )}
                </div>
                <div className="w-24 py-2.5 px-3 text-right text-muted-foreground">
                  {file.size || "--"}
                </div>
                <div className="w-52 py-2.5 px-3 flex items-center justify-center gap-2">
                  {file.type !== "folder" && (
                    <>
                      <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={() => handleDownload(file)}>
                        <Download className="mr-1 h-3.5 w-3.5" />
                        下载
                      </Button>
                      <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={() => handleSaveToDisk(file)}>
                        <Cloud className="mr-1 h-3.5 w-3.5" />
                        保存到网盘
                      </Button>
                    </>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {/* Mobile Card List */}
        <div className="md:hidden space-y-2">
          {mockShareFiles.map(file => {
            const Icon = getFileIcon(file.type)
            const iconColor = getFileIconColor(file.type)
            return (
              <div
                key={file.id}
                className="flex items-center gap-3 rounded-lg border border-border bg-card p-3"
              >
                <Icon className={`h-5 w-5 shrink-0 ${iconColor}`} />
                <div className="flex-1 min-w-0">
                  {file.type === "folder" ? (
                    <button
                      className="text-sm font-medium text-card-foreground hover:text-primary transition-colors truncate block w-full text-left"
                      onClick={() => handleFolderClick(file)}
                    >
                      {file.name}
                    </button>
                  ) : (
                    <p className="text-sm font-medium text-card-foreground truncate">{file.name}</p>
                  )}
                  <p className="text-xs text-muted-foreground">{file.size || "文件夹"}</p>
                </div>
                {file.type !== "folder" && (
                  <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0" onClick={() => handleDownload(file)}>
                    <Download className="h-4 w-4" />
                    <span className="sr-only">{"下载 " + file.name}</span>
                  </Button>
                )}
              </div>
            )
          })}
        </div>

        {/* Save to disk notice */}
        <div className="mt-4 flex items-center gap-2 rounded-lg bg-muted/50 px-4 py-3">
          <Badge variant="secondary" className="bg-primary/10 text-primary shrink-0">提示</Badge>
          <p className="text-xs text-muted-foreground">{"\"保存到网盘\" 功能需要登录 FlowPan 账号"}</p>
        </div>
      </main>
    </div>
  )
}
