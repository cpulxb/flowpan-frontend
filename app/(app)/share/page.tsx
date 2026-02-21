"use client"

import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
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
  Trash2,
  Link2,
  Copy,
  ChevronLeft,
  ChevronRight,
  LinkIcon,
} from "lucide-react"
import { getFileTypeInfo } from "@/lib/file-utils"
import { mockShares, type ShareItem } from "@/lib/mock-data"
import { toast } from "sonner"

export default function SharePage() {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [shares] = useState<ShareItem[]>(mockShares)
  const [viewingShare, setViewingShare] = useState<ShareItem | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 15
  const totalPages = Math.max(1, Math.ceil(shares.length / pageSize))
  const pagedShares = shares.slice((currentPage - 1) * pageSize, currentPage * pageSize)

  const handleSelectAll = useCallback(() => {
    if (selectedIds.size === pagedShares.length) {
      setSelectedIds(new Set())
    } else {
      setSelectedIds(new Set(pagedShares.map(s => s.id)))
    }
  }, [selectedIds.size, pagedShares])

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text)
    toast.success("已复制到剪贴板")
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-4 md:px-6 pt-4 pb-2">
        <h1 className="text-xl font-bold text-foreground flex items-center gap-2">
          <Link2 className="h-5 w-5" />
          我的分享
        </h1>
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-2 px-4 md:px-6 pb-4">
        {selectedIds.size > 0 && (
          <Button
            size="sm"
            variant="outline"
            className="text-destructive hover:text-destructive"
            onClick={() => {
              toast.success(`已取消 ${selectedIds.size} 个分享`)
              setSelectedIds(new Set())
            }}
          >
            <Trash2 className="mr-1.5 h-4 w-4" />
            取消分享
          </Button>
        )}
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto px-4 md:px-6">
        <div className="rounded-lg border border-border overflow-hidden">
          <div className="flex items-center bg-muted/50 text-sm font-medium text-muted-foreground border-b border-border">
            <div className="flex items-center justify-center w-10 py-2.5">
              <Checkbox
                checked={pagedShares.length > 0 && selectedIds.size === pagedShares.length}
                onCheckedChange={handleSelectAll}
                aria-label="全选"
              />
            </div>
            <div className="flex-1 py-2.5 px-2">文件名</div>
            <div className="hidden md:block w-20 py-2.5 px-2">有效期</div>
            <div className="hidden md:block w-24 py-2.5 px-2">分享时间</div>
            <div className="w-28 py-2.5 px-2 text-center">操作</div>
          </div>

          {pagedShares.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
              <LinkIcon className="h-12 w-12 mb-3 opacity-30" />
              <p className="text-sm">暂无分享记录</p>
            </div>
          ) : (
            pagedShares.map(share => {
              const typeInfo = getFileTypeInfo(share.fileType)
              const Icon = typeInfo.icon
              return (
                <div
                  key={share.id}
                  className="flex items-center text-sm border-b border-border last:border-b-0 hover:bg-muted/30 transition-colors"
                >
                  <div className="flex items-center justify-center w-10 py-2.5">
                    <Checkbox
                      checked={selectedIds.has(share.id)}
                      onCheckedChange={() => {
                        setSelectedIds(prev => {
                          const next = new Set(prev)
                          next.has(share.id) ? next.delete(share.id) : next.add(share.id)
                          return next
                        })
                      }}
                      aria-label={`选择 ${share.fileName}`}
                    />
                  </div>
                  <div className="flex items-center gap-2.5 flex-1 py-2.5 px-2 min-w-0">
                    <Icon className={`h-5 w-5 shrink-0 ${typeInfo.color}`} />
                    <span className="truncate text-foreground font-medium">{share.fileName}</span>
                  </div>
                  <div className="hidden md:block w-20 py-2.5 px-2 text-muted-foreground">{share.validity}</div>
                  <div className="hidden md:block w-24 py-2.5 px-2 text-muted-foreground">{share.sharedAt}</div>
                  <div className="w-28 py-2.5 px-2 flex items-center justify-center gap-1">
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-primary" onClick={() => setViewingShare(share)} title="查看分享链接">
                      <Link2 className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-primary" onClick={() => handleCopy(`链接: ${share.shareLink}\n提取码: ${share.shareCode}`)} title="复制链接和提取码">
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-destructive" onClick={() => toast.success(`已取消分享 ${share.fileName}`)} title="取消分享">
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

      {/* View Share Link Dialog */}
      <Dialog open={!!viewingShare} onOpenChange={() => setViewingShare(null)}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>分享详情</DialogTitle>
            <DialogDescription className="sr-only">查看分享链接和提取码</DialogDescription>
          </DialogHeader>
          {viewingShare && (
            <div className="space-y-4 rounded-lg border border-border p-4">
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">分享链接</p>
                <div className="flex items-center gap-2">
                  <p className="text-sm text-foreground flex-1 truncate">{viewingShare.shareLink}</p>
                  <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0" onClick={() => handleCopy(viewingShare.shareLink)}>
                    <Copy className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">提取码</p>
                <div className="flex items-center gap-2">
                  <p className="text-sm text-foreground font-mono">{viewingShare.shareCode}</p>
                  <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0" onClick={() => handleCopy(viewingShare.shareCode)}>
                    <Copy className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">到期时间</p>
                <p className="text-sm text-foreground">{viewingShare.expiresAt}</p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setViewingShare(null)}>关闭</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
