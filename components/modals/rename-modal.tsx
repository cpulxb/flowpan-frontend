"use client"

import { useState, useEffect } from "react"
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
import type { FileItem } from "@/lib/mock-data"

interface RenameModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  file: FileItem | null
}

export function RenameModal({ open, onOpenChange, file }: RenameModalProps) {
  const [name, setName] = useState("")

  useEffect(() => {
    if (file) setName(file.name)
  }, [file])

  const handleRename = () => {
    if (!name.trim()) {
      toast.error("请输入名称")
      return
    }
    toast.success(`重命名为 "${name}"`)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>重命名</DialogTitle>
        </DialogHeader>
        <div className="space-y-3 py-2">
          <div className="space-y-2">
            <Label className="text-foreground">新名称</Label>
            <Input
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="请输入新名称"
              autoFocus
              onKeyDown={e => e.key === "Enter" && handleRename()}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>取消</Button>
          <Button onClick={handleRename}>确定</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
