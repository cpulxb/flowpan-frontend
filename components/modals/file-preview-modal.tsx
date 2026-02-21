"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Download, FileQuestion } from "lucide-react"
import { toast } from "sonner"
import type { FileItem } from "@/lib/mock-data"
import { getFileTypeInfo } from "@/lib/file-utils"

interface FilePreviewModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  file: FileItem | null
}

export function FilePreviewModal({ open, onOpenChange, file }: FilePreviewModalProps) {
  if (!file) return null

  const typeInfo = getFileTypeInfo(file.type)

  const renderPreview = () => {
    switch (file.type) {
      case "image":
        return (
          <div className="flex items-center justify-center bg-muted rounded-lg p-8 min-h-[300px]">
            <div className="text-center space-y-3">
              <div className="h-48 w-48 mx-auto bg-gradient-to-br from-primary/20 to-primary/5 rounded-lg flex items-center justify-center">
                <typeInfo.icon className={`h-16 w-16 ${typeInfo.color} opacity-50`} />
              </div>
              <p className="text-sm text-muted-foreground">{file.name}</p>
            </div>
          </div>
        )
      case "video":
        return (
          <div className="bg-muted rounded-lg overflow-hidden">
            <div className="aspect-video flex items-center justify-center bg-foreground/5">
              <div className="text-center space-y-3">
                <typeInfo.icon className={`h-16 w-16 mx-auto ${typeInfo.color} opacity-50`} />
                <p className="text-sm text-muted-foreground">视频预览区域</p>
                {file.status === "transcoding" && (
                  <p className="text-xs text-warning">视频正在转码中，请稍后再试</p>
                )}
              </div>
            </div>
          </div>
        )
      case "music":
        return (
          <div className="flex flex-col items-center justify-center bg-muted rounded-lg p-8 min-h-[200px] space-y-4">
            <typeInfo.icon className={`h-16 w-16 ${typeInfo.color} opacity-50`} />
            <p className="text-sm text-foreground">{file.name}</p>
            <div className="w-full max-w-xs h-10 bg-foreground/5 rounded-full flex items-center px-4 gap-3">
              <div className="w-3 h-3 rounded-full bg-primary" />
              <div className="flex-1 h-1 bg-border rounded-full">
                <div className="w-1/3 h-full bg-primary rounded-full" />
              </div>
              <span className="text-xs text-muted-foreground">1:23 / 4:05</span>
            </div>
          </div>
        )
      case "doc":
        return (
          <div className="flex flex-col items-center justify-center bg-muted rounded-lg p-8 min-h-[300px] space-y-4">
            <typeInfo.icon className={`h-16 w-16 ${typeInfo.color} opacity-50`} />
            <p className="text-sm text-foreground">{file.name}</p>
            <div className="w-full max-w-sm space-y-2 opacity-30">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="h-2 bg-foreground/20 rounded" style={{ width: `${60 + Math.random() * 40}%` }} />
              ))}
            </div>
          </div>
        )
      default:
        return (
          <div className="flex flex-col items-center justify-center bg-muted rounded-lg p-12 min-h-[200px] space-y-4">
            <FileQuestion className="h-16 w-16 text-muted-foreground opacity-50" />
            <p className="text-sm text-muted-foreground">暂不支持预览此文件类型</p>
            <Button variant="outline" size="sm" onClick={() => toast.success("开始下载 " + file.name)}>
              <Download className="mr-2 h-4 w-4" />
              下载文件
            </Button>
          </div>
        )
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <typeInfo.icon className={`h-5 w-5 ${typeInfo.color}`} />
            {file.name}
          </DialogTitle>
        </DialogHeader>
        {renderPreview()}
      </DialogContent>
    </Dialog>
  )
}
