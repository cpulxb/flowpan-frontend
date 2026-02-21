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
import { toast } from "sonner"

interface NewFolderModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function NewFolderModal({ open, onOpenChange }: NewFolderModalProps) {
  const [name, setName] = useState("新建文件夹")

  const handleCreate = () => {
    if (!name.trim()) {
      toast.error("请输入文件夹名称")
      return
    }
    toast.success(`文件夹 "${name}" 创建成功`)
    onOpenChange(false)
    setName("新建文件夹")
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>新建文件夹</DialogTitle>
        </DialogHeader>
        <div className="space-y-3 py-2">
          <div className="space-y-2">
            <Label className="text-foreground">文件夹名称</Label>
            <Input
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="请输入文件夹名称"
              autoFocus
              onKeyDown={e => e.key === "Enter" && handleCreate()}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>取消</Button>
          <Button onClick={handleCreate}>创建</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
