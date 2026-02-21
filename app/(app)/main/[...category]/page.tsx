"use client"

import { useState, useMemo, useRef, useCallback } from "react"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import {
  Upload,
  FolderPlus,
  FolderUp,
  FileUp,
  Trash2,
  FolderInput,
  Search,
  MoreHorizontal,
  Eye,
  Download,
  Pencil,
  Share2,
  Loader2,
  ChevronLeft,
  ChevronRight,
  LayoutGrid,
  LayoutList,
  ArrowUpDown,
  SlidersHorizontal,
  X,
} from "lucide-react"
import { getFileTypeInfo } from "@/lib/file-utils"
import { mockFiles, formatFileSize, type FileItem } from "@/lib/mock-data"
import { NewFolderModal } from "@/components/modals/new-folder-modal"
import { MoveFileModal } from "@/components/modals/move-file-modal"
import { ShareModal } from "@/components/modals/share-modal"
import { FilePreviewModal } from "@/components/modals/file-preview-modal"
import { RenameModal } from "@/components/modals/rename-modal"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

const PAGE_SIZE = 15
const categoryLabels: Record<string, string> = {
  all: "全部文件",
  video: "视频",
  music: "音乐",
  image: "图片",
  doc: "文档",
  other: "其他",
}

type SortField = "name" | "size" | "modifiedAt"
type SortOrder = "asc" | "desc"
type ViewMode = "table" | "grid"

const sortLabels: Record<SortField, string> = {
  name: "文件名",
  size: "大小",
  modifiedAt: "修改时间",
}

export default function FileManagementPage() {
  const params = useParams()
  const category = (params.category as string[])?.[0] || "all"
  const fileInputRef = useRef<HTMLInputElement>(null)
  const folderInputRef = useRef<HTMLInputElement>(null)

  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null)
  const [folderPath, setFolderPath] = useState<{ id: string | null; name: string }[]>([
    { id: null, name: categoryLabels[category] || "全部文件" },
  ])
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [viewMode, setViewMode] = useState<ViewMode>("table")
  const [sortField, setSortField] = useState<SortField>("modifiedAt")
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc")
  const [filterType, setFilterType] = useState<string>("all")

  // Modals
  const [newFolderOpen, setNewFolderOpen] = useState(false)
  const [moveFileOpen, setMoveFileOpen] = useState(false)
  const [shareModalOpen, setShareModalOpen] = useState(false)
  const [previewOpen, setPreviewOpen] = useState(false)
  const [renameOpen, setRenameOpen] = useState(false)
  const [activeFile, setActiveFile] = useState<FileItem | null>(null)

  const filteredFiles = useMemo(() => {
    let files = mockFiles.filter(f => f.parentId === currentFolderId)
    if (category !== "all") {
      files = files.filter(f => f.type === category || f.type === "folder")
    }
    if (filterType !== "all") {
      files = files.filter(f => f.type === filterType)
    }
    if (searchQuery) {
      files = files.filter(f => f.name.toLowerCase().includes(searchQuery.toLowerCase()))
    }
    // Sort: folders always first
    const folders = files.filter(f => f.type === "folder")
    const nonFolders = files.filter(f => f.type !== "folder")

    const sortFn = (a: FileItem, b: FileItem): number => {
      let cmp = 0
      if (sortField === "name") {
        cmp = a.name.localeCompare(b.name, "zh-CN")
      } else if (sortField === "size") {
        cmp = (a.size || 0) - (b.size || 0)
      } else {
        cmp = a.modifiedAt.localeCompare(b.modifiedAt)
      }
      return sortOrder === "asc" ? cmp : -cmp
    }

    folders.sort(sortFn)
    nonFolders.sort(sortFn)

    return [...folders, ...nonFolders]
  }, [currentFolderId, category, searchQuery, sortField, sortOrder, filterType])

  const totalPages = Math.max(1, Math.ceil(filteredFiles.length / PAGE_SIZE))
  const pagedFiles = filteredFiles.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

  const handleSelectAll = useCallback(() => {
    if (selectedIds.size === pagedFiles.length) {
      setSelectedIds(new Set())
    } else {
      setSelectedIds(new Set(pagedFiles.map(f => f.id)))
    }
  }, [selectedIds.size, pagedFiles])

  const handleSelectFile = useCallback((id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }, [])

  const navigateToFolder = useCallback((file: FileItem) => {
    if (file.type === "folder") {
      setCurrentFolderId(file.id)
      setFolderPath(prev => [...prev, { id: file.id, name: file.name }])
      setSelectedIds(new Set())
      setCurrentPage(1)
    }
  }, [])

  const navigateToBreadcrumb = useCallback((index: number) => {
    const target = folderPath[index]
    setCurrentFolderId(target.id)
    setFolderPath(prev => prev.slice(0, index + 1))
    setSelectedIds(new Set())
    setCurrentPage(1)
  }, [folderPath])

  const toggleSort = useCallback((field: SortField) => {
    if (sortField === field) {
      setSortOrder(prev => (prev === "asc" ? "desc" : "asc"))
    } else {
      setSortField(field)
      setSortOrder("desc")
    }
    setCurrentPage(1)
  }, [sortField])

  const hasSelection = selectedIds.size > 0

  const fileActions = useCallback((file: FileItem) => (
    <DropdownMenuContent align="end" className="w-40">
      {file.type !== "folder" && (
        <>
          <DropdownMenuItem onClick={() => { setActiveFile(file); setPreviewOpen(true) }}>
            <Eye className="mr-2 h-4 w-4" />预览
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => toast.success("开始下载 " + file.name)}>
            <Download className="mr-2 h-4 w-4" />下载
          </DropdownMenuItem>
        </>
      )}
      <DropdownMenuItem onClick={() => { setActiveFile(file); setRenameOpen(true) }}>
        <Pencil className="mr-2 h-4 w-4" />重命名
      </DropdownMenuItem>
      <DropdownMenuItem onClick={() => { setActiveFile(file); setMoveFileOpen(true) }}>
        <FolderInput className="mr-2 h-4 w-4" />移动到
      </DropdownMenuItem>
      <DropdownMenuItem onClick={() => { setActiveFile(file); setShareModalOpen(true) }}>
        <Share2 className="mr-2 h-4 w-4" />分享
      </DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => toast.success(`已将 ${file.name} 移入回收站`)}>
        <Trash2 className="mr-2 h-4 w-4" />删除
      </DropdownMenuItem>
    </DropdownMenuContent>
  ), [])

  return (
    <div className="flex flex-col h-full">
      {/* Breadcrumb + View Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 px-4 md:px-6 pt-4 pb-2">
        <Breadcrumb>
          <BreadcrumbList>
            {folderPath.map((item, index) => (
              <BreadcrumbItem key={index}>
                {index < folderPath.length - 1 ? (
                  <>
                    <BreadcrumbLink className="cursor-pointer hover:text-primary transition-colors" onClick={() => navigateToBreadcrumb(index)}>
                      {item.name}
                    </BreadcrumbLink>
                    <BreadcrumbSeparator />
                  </>
                ) : (
                  <BreadcrumbPage className="font-medium">{item.name}</BreadcrumbPage>
                )}
              </BreadcrumbItem>
            ))}
          </BreadcrumbList>
        </Breadcrumb>

        <div className="flex items-center gap-1">
          <Button variant={viewMode === "table" ? "secondary" : "ghost"} size="icon" className="h-8 w-8" onClick={() => setViewMode("table")} aria-label="列表视图">
            <LayoutList className="h-4 w-4" />
          </Button>
          <Button variant={viewMode === "grid" ? "secondary" : "ghost"} size="icon" className="h-8 w-8" onClick={() => setViewMode("grid")} aria-label="网格视图">
            <LayoutGrid className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-2 px-4 md:px-6 pb-3">
        {/* Upload dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="sm" className="gap-1.5">
              <Upload className="h-4 w-4" />
              <span className="hidden sm:inline">上传</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-36">
            <DropdownMenuItem onClick={() => fileInputRef.current?.click()}>
              <FileUp className="mr-2 h-4 w-4" />上传文件
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => folderInputRef.current?.click()}>
              <FolderUp className="mr-2 h-4 w-4" />上传文件夹
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <input ref={fileInputRef} type="file" multiple className="hidden" onChange={() => toast.success("文件已添加到上传队列")} />
        <input
          ref={folderInputRef}
          type="file"
          // @ts-expect-error webkitdirectory is not in the type definitions
          webkitdirectory=""
          directory=""
          multiple
          className="hidden"
          onChange={() => toast.success("文件夹已添加到上传队列")}
        />

        <Button size="sm" variant="outline" onClick={() => setNewFolderOpen(true)}>
          <FolderPlus className="mr-1.5 h-4 w-4" />
          <span className="hidden sm:inline">新建文件夹</span>
        </Button>

        {hasSelection && (
          <>
            <div className="h-5 w-px bg-border" />
            <span className="text-xs text-muted-foreground">已选 {selectedIds.size} 项</span>
            <Button size="sm" variant="outline" className="text-destructive hover:text-destructive" onClick={() => toast.success(`已将 ${selectedIds.size} 个文件移入回收站`)}>
              <Trash2 className="mr-1.5 h-4 w-4" />删除
            </Button>
            <Button size="sm" variant="outline" onClick={() => setMoveFileOpen(true)}>
              <FolderInput className="mr-1.5 h-4 w-4" />移动
            </Button>
          </>
        )}

        <div className="flex items-center gap-2 ml-auto">
          {/* Sort */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-8 gap-1.5">
                <ArrowUpDown className="h-3.5 w-3.5" />
                <span className="hidden sm:inline text-xs">{sortLabels[sortField]}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuLabel className="text-xs">排序方式</DropdownMenuLabel>
              <DropdownMenuRadioGroup value={sortField} onValueChange={v => toggleSort(v as SortField)}>
                <DropdownMenuRadioItem value="name">文件名</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="size">大小</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="modifiedAt">修改时间</DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
              <DropdownMenuSeparator />
              <DropdownMenuRadioGroup value={sortOrder} onValueChange={v => setSortOrder(v as SortOrder)}>
                <DropdownMenuRadioItem value="asc">升序</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="desc">降序</DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Filter */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant={filterType !== "all" ? "default" : "outline"} size="sm" className="h-8 gap-1.5">
                <SlidersHorizontal className="h-3.5 w-3.5" />
                <span className="hidden sm:inline text-xs">筛选</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-36">
              <DropdownMenuLabel className="text-xs">文件类型</DropdownMenuLabel>
              <DropdownMenuRadioGroup value={filterType} onValueChange={v => { setFilterType(v); setCurrentPage(1) }}>
                <DropdownMenuRadioItem value="all">全部</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="folder">文件夹</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="video">视频</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="music">音乐</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="image">图片</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="doc">文档</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="other">其他</DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Search */}
          <div className="relative w-40 sm:w-48">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              placeholder="搜索文件..."
              className="pl-8 h-8 text-sm"
              value={searchQuery}
              onChange={e => { setSearchQuery(e.target.value); setCurrentPage(1) }}
            />
            {searchQuery && (
              <button className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground" onClick={() => setSearchQuery("")}>
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Active filter tags */}
      {(filterType !== "all" || searchQuery) && (
        <div className="flex items-center gap-2 px-4 md:px-6 pb-2">
          {filterType !== "all" && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-primary/10 text-primary text-xs">
              类型: {categoryLabels[filterType] || filterType}
              <button onClick={() => setFilterType("all")} className="hover:text-primary/70"><X className="h-3 w-3" /></button>
            </span>
          )}
          {searchQuery && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-primary/10 text-primary text-xs">
              搜索: {searchQuery}
              <button onClick={() => setSearchQuery("")} className="hover:text-primary/70"><X className="h-3 w-3" /></button>
            </span>
          )}
        </div>
      )}

      {/* File List */}
      <div className="flex-1 overflow-auto px-4 md:px-6">
        {pagedFiles.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-muted-foreground">
            <FolderPlus className="h-16 w-16 mb-4 opacity-20" />
            <p className="text-base font-medium mb-1">暂无文件</p>
            <p className="text-sm opacity-70">上传文件或新建文件夹开始使用</p>
          </div>
        ) : viewMode === "table" ? (
          /* TABLE VIEW */
          <div className="rounded-lg border border-border overflow-hidden">
            {/* Table Header */}
            <div className="flex items-center bg-muted/50 text-xs font-medium text-muted-foreground border-b border-border">
              <div className="flex items-center justify-center w-10 py-2.5">
                <Checkbox checked={pagedFiles.length > 0 && selectedIds.size === pagedFiles.length} onCheckedChange={handleSelectAll} aria-label="全选" />
              </div>
              <button className="flex items-center gap-1 flex-1 py-2.5 px-2 hover:text-foreground transition-colors text-left" onClick={() => toggleSort("name")}>
                文件名
                {sortField === "name" && <ArrowUpDown className="h-3 w-3" />}
              </button>
              <button className="hidden md:flex items-center gap-1 w-24 py-2.5 px-2 justify-end hover:text-foreground transition-colors" onClick={() => toggleSort("size")}>
                大小
                {sortField === "size" && <ArrowUpDown className="h-3 w-3" />}
              </button>
              <button className="hidden lg:flex items-center gap-1 w-32 py-2.5 px-2 hover:text-foreground transition-colors" onClick={() => toggleSort("modifiedAt")}>
                修改时间
                {sortField === "modifiedAt" && <ArrowUpDown className="h-3 w-3" />}
              </button>
              <div className="w-12 py-2.5" />
            </div>

            {/* Table Body */}
            {pagedFiles.map(file => {
              const typeInfo = getFileTypeInfo(file.type)
              const Icon = typeInfo.icon
              const isSelected = selectedIds.has(file.id)
              return (
                <div
                  key={file.id}
                  className={cn(
                    "flex items-center text-sm border-b border-border last:border-b-0 transition-colors group cursor-default",
                    isSelected ? "bg-primary/5" : "hover:bg-muted/30"
                  )}
                >
                  <div className="flex items-center justify-center w-10 py-2.5">
                    <Checkbox checked={isSelected} onCheckedChange={() => handleSelectFile(file.id)} aria-label={`选择 ${file.name}`} />
                  </div>
                  <div
                    className="flex items-center gap-2.5 flex-1 py-2.5 px-2 min-w-0 cursor-pointer"
                    onClick={() => file.type === "folder" && navigateToFolder(file)}
                    onDoubleClick={() => {
                      if (file.type !== "folder") { setActiveFile(file); setPreviewOpen(true) }
                    }}
                  >
                    <Icon className={cn("h-5 w-5 shrink-0", typeInfo.color)} />
                    <span className="truncate text-foreground font-medium">{file.name}</span>
                    {file.status === "transcoding" && (
                      <span className="flex items-center gap-1 text-xs text-warning shrink-0">
                        <Loader2 className="h-3 w-3 animate-spin" />转码中
                      </span>
                    )}
                  </div>
                  <div className="hidden md:block w-24 py-2.5 px-2 text-right text-xs text-muted-foreground">
                    {formatFileSize(file.size)}
                  </div>
                  <div className="hidden lg:block w-32 py-2.5 px-2 text-xs text-muted-foreground">
                    {file.modifiedAt}
                  </div>
                  <div className="w-12 py-2.5 flex items-center justify-center">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-7 w-7 opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity text-muted-foreground hover:text-foreground">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">操作</span>
                        </Button>
                      </DropdownMenuTrigger>
                      {fileActions(file)}
                    </DropdownMenu>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          /* GRID VIEW */
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
            {pagedFiles.map(file => {
              const typeInfo = getFileTypeInfo(file.type)
              const Icon = typeInfo.icon
              const isSelected = selectedIds.has(file.id)
              return (
                <div
                  key={file.id}
                  className={cn(
                    "group relative flex flex-col items-center rounded-xl border border-border p-4 transition-all hover:shadow-md cursor-pointer",
                    isSelected ? "border-primary bg-primary/5 shadow-sm" : "hover:border-border/80 bg-card"
                  )}
                  onClick={() => file.type === "folder" ? navigateToFolder(file) : undefined}
                  onDoubleClick={() => {
                    if (file.type !== "folder") { setActiveFile(file); setPreviewOpen(true) }
                  }}
                >
                  {/* Checkbox - top left */}
                  <div className={cn(
                    "absolute top-2 left-2 transition-opacity",
                    isSelected ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                  )}>
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={(e) => { e; handleSelectFile(file.id) }}
                      onClick={(e) => e.stopPropagation()}
                      aria-label={`选择 ${file.name}`}
                    />
                  </div>

                  {/* Action menu - top right */}
                  <div className={cn(
                    "absolute top-1.5 right-1.5 transition-opacity",
                    isSelected ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                  )}>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-foreground" onClick={e => e.stopPropagation()}>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      {fileActions(file)}
                    </DropdownMenu>
                  </div>

                  <div className={cn(
                    "flex items-center justify-center h-14 w-14 rounded-xl mb-3 transition-transform group-hover:scale-105",
                    file.type === "folder" ? "bg-[#f0ad4e]/10" : "bg-muted"
                  )}>
                    <Icon className={cn("h-7 w-7", typeInfo.color)} />
                  </div>

                  <p className="text-sm font-medium text-foreground text-center truncate w-full px-1" title={file.name}>
                    {file.name}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {file.type === "folder" ? "文件夹" : formatFileSize(file.size)}
                  </p>
                  {file.status === "transcoding" && (
                    <span className="flex items-center gap-1 text-[10px] text-warning mt-1">
                      <Loader2 className="h-3 w-3 animate-spin" />转码中
                    </span>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Pagination */}
      {filteredFiles.length > 0 && (
        <div className="flex items-center justify-between px-4 md:px-6 py-3 text-sm text-muted-foreground border-t border-border shrink-0">
          <span className="text-xs">
            共 {filteredFiles.length} 项
            {selectedIds.size > 0 && ` / 已选 ${selectedIds.size} 项`}
          </span>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" className="h-7 w-7" disabled={currentPage <= 1} onClick={() => setCurrentPage(p => p - 1)}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter(p => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1)
              .map((p, idx, arr) => (
                <span key={p} className="flex items-center">
                  {idx > 0 && arr[idx - 1] !== p - 1 && <span className="px-0.5 text-muted-foreground text-xs">...</span>}
                  <Button variant={p === currentPage ? "default" : "ghost"} size="icon" className="h-7 w-7 text-xs" onClick={() => setCurrentPage(p)}>
                    {p}
                  </Button>
                </span>
              ))}
            <Button variant="ghost" size="icon" className="h-7 w-7" disabled={currentPage >= totalPages} onClick={() => setCurrentPage(p => p + 1)}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Modals */}
      <NewFolderModal open={newFolderOpen} onOpenChange={setNewFolderOpen} />
      <MoveFileModal open={moveFileOpen} onOpenChange={setMoveFileOpen} />
      <ShareModal open={shareModalOpen} onOpenChange={setShareModalOpen} file={activeFile} />
      <FilePreviewModal open={previewOpen} onOpenChange={setPreviewOpen} file={activeFile} />
      <RenameModal open={renameOpen} onOpenChange={setRenameOpen} file={activeFile} />
    </div>
  )
}
