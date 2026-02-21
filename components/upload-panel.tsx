"use client"

import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { X, Eraser, CheckCircle, XCircle, Zap, Clock, CloudUpload } from "lucide-react"
import { cn } from "@/lib/utils"

interface UploadTask {
  id: string
  name: string
  progress: number
  status: "waiting" | "hashing" | "uploading" | "success" | "seconds" | "fail"
}

interface UploadPanelProps {
  tasks: UploadTask[]
  onClose: () => void
  onClear: () => void
}

const statusConfig: Record<
  UploadTask["status"],
  { icon: React.ReactNode; label: string; color: string }
> = {
  waiting: { icon: <Clock className="h-4 w-4" />, label: "等待中...", color: "text-muted-foreground" },
  hashing: { icon: <CloudUpload className="h-4 w-4 animate-pulse" />, label: "计算MD5...", color: "text-primary" },
  uploading: { icon: <CloudUpload className="h-4 w-4" />, label: "上传中...", color: "text-primary" },
  success: { icon: <CheckCircle className="h-4 w-4" />, label: "上传成功", color: "text-success" },
  seconds: { icon: <Zap className="h-4 w-4" />, label: "秒传成功", color: "text-success" },
  fail: { icon: <XCircle className="h-4 w-4" />, label: "上传失败", color: "text-destructive" },
}

export function UploadPanel({ tasks, onClose, onClear }: UploadPanelProps) {
  return (
    <div className="fixed bottom-4 right-4 z-50 w-80 rounded-lg border border-border bg-card shadow-xl">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <span className="text-sm font-medium text-card-foreground">
          上传列表 ({tasks.length})
        </span>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground hover:text-foreground" onClick={onClear} aria-label="清除已完成">
            <Eraser className="h-3.5 w-3.5" />
          </Button>
          <Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground hover:text-foreground" onClick={onClose} aria-label="关闭">
            <X className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      {/* Task List */}
      <div className="max-h-64 overflow-y-auto p-2 space-y-1">
        {tasks.length === 0 && (
          <div className="flex items-center justify-center py-8 text-sm text-muted-foreground">
            暂无上传任务
          </div>
        )}
        {tasks.map(task => {
          const config = statusConfig[task.status]
          return (
            <div key={task.id} className="rounded-md px-3 py-2.5 hover:bg-muted/50 transition-colors">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-card-foreground truncate max-w-[180px]">{task.name}</span>
                <span className={cn("flex items-center gap-1 text-xs", config.color)}>
                  {config.icon}
                </span>
              </div>
              {task.status === "uploading" && (
                <div className="flex items-center gap-2">
                  <Progress value={task.progress} className="h-1 flex-1" />
                  <span className="text-xs text-muted-foreground w-8 text-right">{Math.round(task.progress)}%</span>
                </div>
              )}
              {task.status !== "uploading" && (
                <p className={cn("text-xs", config.color)}>{config.label}</p>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
