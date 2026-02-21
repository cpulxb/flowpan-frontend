"use client"

import { useRef } from "react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  PanelLeftClose,
  PanelLeftOpen,
  Upload,
  FolderUp,
  FileUp,
  Moon,
  Sun,
  ArrowUpCircle,
  ChevronDown,
  User,
  LogOut,
  Cloud,
  CheckCircle,
  Loader2,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface AppHeaderProps {
  onToggleSidebar: () => void
  sidebarCollapsed: boolean
  onOpenSettings: () => void
  activeUploadCount: number
  totalUploadCount: number
  completedUploadCount: number
  onToggleUploadPanel: () => void
  onUploadFiles: (files: FileList) => void
  onUploadFolder: (files: FileList) => void
}

export function AppHeader({
  onToggleSidebar,
  sidebarCollapsed,
  onOpenSettings,
  activeUploadCount,
  totalUploadCount,
  completedUploadCount,
  onToggleUploadPanel,
  onUploadFiles,
  onUploadFolder,
}: AppHeaderProps) {
  const { theme, setTheme } = useTheme()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const folderInputRef = useRef<HTMLInputElement>(null)

  const hasActiveUploads = activeUploadCount > 0
  const hasCompletedAll = totalUploadCount > 0 && activeUploadCount === 0

  return (
    <header className="flex h-14 items-center justify-between border-b border-border bg-background px-4 shrink-0">
      <div className="flex items-center gap-2">
        {/* Sidebar toggle */}
        <Button
          variant="ghost"
          size="icon"
          className="hidden md:inline-flex h-8 w-8 text-muted-foreground hover:text-foreground"
          onClick={onToggleSidebar}
          aria-label={sidebarCollapsed ? "展开侧边栏" : "收起侧边栏"}
        >
          {sidebarCollapsed ? (
            <PanelLeftOpen className="h-4 w-4" />
          ) : (
            <PanelLeftClose className="h-4 w-4" />
          )}
        </Button>

        {/* Mobile brand */}
        <div className="flex items-center gap-2 md:hidden">
          <Cloud className="h-5 w-5 text-primary" />
          <span className="font-bold text-foreground">FlowPan</span>
        </div>
      </div>

      <div className="flex items-center gap-1">
        {/* Upload dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 gap-1.5 px-2.5 text-muted-foreground hover:text-foreground"
            >
              <Upload className="h-4 w-4" />
              <span className="hidden sm:inline text-sm">上传</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuItem onClick={() => fileInputRef.current?.click()}>
              <FileUp className="mr-2 h-4 w-4" />
              上传文件
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => folderInputRef.current?.click()}>
              <FolderUp className="mr-2 h-4 w-4" />
              上传文件夹
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Hidden inputs */}
        <input
          ref={fileInputRef}
          type="file"
          multiple
          className="hidden"
          onChange={e => {
            if (e.target.files?.length) {
              onUploadFiles(e.target.files)
              e.target.value = ""
            }
          }}
        />
        <input
          ref={folderInputRef}
          type="file"
          // @ts-expect-error webkitdirectory is not in the type definitions
          webkitdirectory=""
          directory=""
          multiple
          className="hidden"
          onChange={e => {
            if (e.target.files?.length) {
              onUploadFolder(e.target.files)
              e.target.value = ""
            }
          }}
        />

        {/* Upload Status Button */}
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "relative h-8 w-8 transition-colors",
            hasActiveUploads
              ? "text-primary hover:text-primary"
              : hasCompletedAll
                ? "text-success hover:text-success"
                : "text-muted-foreground hover:text-foreground"
          )}
          onClick={onToggleUploadPanel}
          aria-label="上传管理"
        >
          {hasActiveUploads ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : hasCompletedAll ? (
            <CheckCircle className="h-4 w-4" />
          ) : (
            <ArrowUpCircle className="h-4 w-4" />
          )}
          {activeUploadCount > 0 && (
            <Badge className="absolute -top-1 -right-1 h-4 min-w-4 px-1 text-[10px] flex items-center justify-center bg-primary text-primary-foreground border-0">
              {activeUploadCount}
            </Badge>
          )}
        </Button>

        {/* Divider */}
        <div className="h-5 w-px bg-border mx-0.5" />

        {/* Theme toggle */}
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-muted-foreground hover:text-foreground"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          aria-label="切换主题"
        >
          <Sun className="h-4 w-4 dark:hidden" />
          <Moon className="hidden h-4 w-4 dark:block" />
        </Button>

        {/* User menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 gap-2 px-2 text-foreground">
              <Avatar className="h-6 w-6">
                <AvatarFallback className="text-xs bg-primary text-primary-foreground">
                  U
                </AvatarFallback>
              </Avatar>
              <span className="hidden sm:inline text-sm font-medium">用户</span>
              <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuItem onClick={onOpenSettings}>
              <User className="mr-2 h-4 w-4" />
              个人设置
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-destructive focus:text-destructive"
              onClick={() => {
                window.location.href = "/login"
              }}
            >
              <LogOut className="mr-2 h-4 w-4" />
              退出登录
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
