"use client"

import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  Trash2,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { getFileTypeInfo } from "@/lib/file-utils"
import { mockRecycle, formatFileSize, type RecycleItem } from "@/lib/mock-data"
import { toast } from "sonner"

export default function RecyclePage() {
  const [items, setItems] = useState<RecycleItem[]>(mockRecycle)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 15
  const totalPages = Math.max(1, Math.ceil(items.length / pageSize))
  const pagedItems = items.slice((currentPage - 1) * pageSize, currentPage * pageSize)

  const handleSelectAll = useCallback(() => {
    if (selectedIds.size === pagedItems.length) {
      setSelectedIds(new Set())
    } else {
      setSelectedIds(new Set(pagedItems.map(s => s.id)))
    }
  }, [selectedIds.size, pagedItems])

  const handleRestore = (ids: Set<string>) => {
    setItems(prev => prev.filter(i => !ids.has(i.id)))
    setSelectedIds(new Set())
    toast.success(`已还原 ${ids.size} 个文件`)
  }

  const handlePermanentDelete = () => {
    setItems(prev => prev.filter(i => !selectedIds.has(i.id)))
    toast.success(`已彻底删除 ${selectedIds.size} 个文件`)
    setSelectedIds(new Set())
    setConfirmDeleteOpen(false)
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-4 md:px-6 pt-4 pb-2">
        <h1 className="text-xl font-bold text-foreground flex items-center gap-2">
          <Trash2 className="h-5 w-5" />
          回收站
        </h1>
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-2 px-4 md:px-6 pb-4">
        {selectedIds.size > 0 && (
          <>
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleRestore(selectedIds)}
            >
              <RotateCcw className="mr-1.5 h-4 w-4" />
              还原
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="text-destructive hover:text-destructive"
              onClick={() => setConfirmDeleteOpen(true)}
            >
              <Trash2 className="mr-1.5 h-4 w-4" />
              彻底删除
            </Button>
          </>
        )}
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto px-4 md:px-6">
        <div className="rounded-lg border border-border overflow-hidden">
          <div className="flex items-center bg-muted/50 text-sm font-medium text-muted-foreground border-b border-border">
            <div className="flex items-center justify-center w-10 py-2.5">
              <Checkbox
                checked={pagedItems.length > 0 && selectedIds.size === pagedItems.length}
                onCheckedChange={handleSelectAll}
                aria-label="全选"
              />
            </div>
            <div className="flex-1 py-2.5 px-2">文件名</div>
            <div className="hidden md:block w-24 py-2.5 px-2 text-right">大小</div>
            <div className="hidden md:block w-28 py-2.5 px-2">删除时间</div>
            <div className="w-24 py-2.5 px-2 text-center">操作</div>
          </div>

          {pagedItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
              <Trash2 className="h-12 w-12 mb-3 opacity-30" />
              <p className="text-sm">回收站为空</p>
            </div>
          ) : (
            pagedItems.map(item => {
              const typeInfo = getFileTypeInfo(item.type)
              const Icon = typeInfo.icon
              return (
                <div
                  key={item.id}
                  className="flex items-center text-sm border-b border-border last:border-b-0 hover:bg-muted/30 transition-colors"
                >
                  <div className="flex items-center justify-center w-10 py-2.5">
                    <Checkbox
                      checked={selectedIds.has(item.id)}
                      onCheckedChange={() => {
                        setSelectedIds(prev => {
                          const next = new Set(prev)
                          next.has(item.id) ? next.delete(item.id) : next.add(item.id)
                          return next
                        })
                      }}
                      aria-label={`选择 ${item.name}`}
                    />
                  </div>
                  <div className="flex items-center gap-2.5 flex-1 py-2.5 px-2 min-w-0">
                    <Icon className={`h-5 w-5 shrink-0 ${typeInfo.color}`} />
                    <span className="truncate text-foreground font-medium opacity-70">{item.name}</span>
                  </div>
                  <div className="hidden md:block w-24 py-2.5 px-2 text-right text-muted-foreground">{formatFileSize(item.size)}</div>
                  <div className="hidden md:block w-28 py-2.5 px-2 text-muted-foreground">{item.deletedAt}</div>
                  <div className="w-24 py-2.5 px-2 flex items-center justify-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-muted-foreground hover:text-primary"
                      onClick={() => handleRestore(new Set([item.id]))}
                      title="还原文件"
                    >
                      <RotateCcw className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-muted-foreground hover:text-destructive"
                      onClick={() => {
                        setSelectedIds(new Set([item.id]))
                        setConfirmDeleteOpen(true)
                      }}
                      title="彻底删除"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-end px-4 md:px-6 py-3 border-t border-border">
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

      {/* Confirm Delete */}
      <AlertDialog open={confirmDeleteOpen} onOpenChange={setConfirmDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>确认删除</AlertDialogTitle>
            <AlertDialogDescription>
              确定要彻底删除选中的 {selectedIds.size} 个文件吗？此操作不可撤销，文件将被永久删除且无法恢复。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={handlePermanentDelete}
            >
              删除
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
