"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { CheckCircle, Copy, Link2 } from "lucide-react"
import { toast } from "sonner"
import type { FileItem } from "@/lib/mock-data"
import { getFileTypeInfo } from "@/lib/file-utils"

interface ShareModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  file: FileItem | null
}

export function ShareModal({ open, onOpenChange, file }: ShareModalProps) {
  const [validity, setValidity] = useState("7")
  const [codeType, setCodeType] = useState("random")
  const [customCode, setCustomCode] = useState("")
  const [shareResult, setShareResult] = useState<{
    link: string
    code: string
    expiresAt: string
  } | null>(null)

  const handleCreateShare = () => {
    const code = codeType === "random" ? "ab12c" : customCode
    if (codeType === "custom" && (!customCode || customCode.length > 5)) {
      toast.error("请输入5位以内的提取码")
      return
    }
    setShareResult({
      link: `https://flowpan.com/s/${Math.random().toString(36).slice(2, 10)}`,
      code,
      expiresAt: validity === "forever" ? "永久有效" : `2026-02-${20 + parseInt(validity)}`,
    })
  }

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text)
    toast.success("已复制到剪贴板")
  }

  const handleClose = () => {
    onOpenChange(false)
    setShareResult(null)
    setValidity("7")
    setCodeType("random")
    setCustomCode("")
  }

  if (!file) return null

  const typeInfo = getFileTypeInfo(file.type)
  const Icon = typeInfo.icon

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{shareResult ? "分享成功" : "分享文件"}</DialogTitle>
        </DialogHeader>

        {!shareResult ? (
          <>
            <div className="flex items-center gap-2 py-2">
              <Icon className={`h-5 w-5 ${typeInfo.color}`} />
              <span className="text-sm font-medium text-foreground">{file.name}</span>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-foreground">有效期</Label>
                <RadioGroup value={validity} onValueChange={setValidity} className="flex gap-4">
                  {[
                    { value: "1", label: "1天" },
                    { value: "7", label: "7天" },
                    { value: "30", label: "30天" },
                    { value: "forever", label: "永久" },
                  ].map(opt => (
                    <div key={opt.value} className="flex items-center gap-1.5">
                      <RadioGroupItem value={opt.value} id={`v-${opt.value}`} />
                      <Label htmlFor={`v-${opt.value}`} className="text-sm cursor-pointer text-foreground">{opt.label}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <Label className="text-foreground">提取码</Label>
                <RadioGroup value={codeType} onValueChange={setCodeType} className="flex gap-4">
                  <div className="flex items-center gap-1.5">
                    <RadioGroupItem value="random" id="code-random" />
                    <Label htmlFor="code-random" className="text-sm cursor-pointer text-foreground">随机生成</Label>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <RadioGroupItem value="custom" id="code-custom" />
                    <Label htmlFor="code-custom" className="text-sm cursor-pointer text-foreground">自定义提取码</Label>
                  </div>
                </RadioGroup>
                {codeType === "custom" && (
                  <Input
                    placeholder="输入5位以内的提取码"
                    maxLength={5}
                    value={customCode}
                    onChange={e => setCustomCode(e.target.value)}
                  />
                )}
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={handleClose}>取消</Button>
              <Button onClick={handleCreateShare}>创建分享</Button>
            </DialogFooter>
          </>
        ) : (
          <>
            <div className="flex items-center gap-2 text-success mb-2">
              <CheckCircle className="h-5 w-5" />
              <span className="text-sm font-medium">分享创建成功</span>
            </div>

            <div className="space-y-4 rounded-lg border border-border p-4">
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">分享链接</p>
                <div className="flex items-center gap-2">
                  <p className="text-sm text-foreground flex-1 truncate">{shareResult.link}</p>
                  <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0" onClick={() => handleCopy(shareResult.link)}>
                    <Copy className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">提取码</p>
                <div className="flex items-center gap-2">
                  <p className="text-sm text-foreground font-mono flex-1">{shareResult.code}</p>
                  <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0" onClick={() => handleCopy(shareResult.code)}>
                    <Copy className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">到期时间</p>
                <p className="text-sm text-foreground">{shareResult.expiresAt}</p>
              </div>
            </div>

            <DialogFooter>
              <Button onClick={handleClose}>完成</Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
