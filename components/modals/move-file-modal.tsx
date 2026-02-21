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
import { Folder, ChevronRight } from "lucide-react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

interface MoveFileModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const folderTree = [
  { id: "1", name: "项目文档" },
  { id: "8", name: "宣传图片" },
  { id: "f1", name: "前端项目" },
  { id: "f2", name: "后端项目" },
  { id: "f3", name: "设计稿" },
  { id: "f4", name: "文档" },
]

export function MoveFileModal({ open, onOpenChange }: MoveFileModalProps) {
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null)
  const [breadcrumbs, setBreadcrumbs] = useState([{ id: "root", name: "根目录" }])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>移动文件到...</DialogTitle>
        </DialogHeader>

        {/* Breadcrumbs */}
        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          {breadcrumbs.map((b, i) => (
            <span key={b.id} className="flex items-center gap-1">
              {i > 0 && <ChevronRight className="h-3 w-3" />}
              <button
                className="hover:text-primary transition-colors"
                onClick={() => {
                  setBreadcrumbs(prev => prev.slice(0, i + 1))
                  setSelectedFolder(null)
                }}
              >
                {b.name}
              </button>
            </span>
          ))}
        </div>

        {/* Folder List */}
        <div className="border border-border rounded-lg max-h-52 overflow-y-auto">
          {folderTree.map(folder => (
            <button
              key={folder.id}
              className={cn(
                "flex items-center gap-3 w-full px-4 py-2.5 text-sm text-left transition-colors hover:bg-muted/50",
                selectedFolder === folder.id && "bg-primary/10 text-primary"
              )}
              onClick={() => setSelectedFolder(folder.id)}
              onDoubleClick={() => {
                setBreadcrumbs(prev => [...prev, { id: folder.id, name: folder.name }])
                setSelectedFolder(null)
              }}
            >
              <Folder className="h-4 w-4 text-[#f0ad4e] shrink-0" />
              <span>{folder.name}</span>
            </button>
          ))}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>取消</Button>
          <Button onClick={() => {
            toast.success("文件移动成功")
            onOpenChange(false)
          }}>
            移动到此处
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
