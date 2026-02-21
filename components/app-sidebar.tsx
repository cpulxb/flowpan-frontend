"use client"

import Link from "next/link"
import { cn } from "@/lib/utils"
import { Progress } from "@/components/ui/progress"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  Cloud,
  Folder,
  Video,
  Music,
  Image as ImageIcon,
  FileText,
  Package,
  Link2,
  Trash2,
  Settings,
  type LucideIcon,
} from "lucide-react"

interface AppSidebarProps {
  collapsed: boolean
  currentPath: string
}

interface NavItem {
  href: string
  label: string
  icon: LucideIcon
}

const fileCategories: NavItem[] = [
  { href: "/main/all", label: "全部文件", icon: Folder },
  { href: "/main/video", label: "视频", icon: Video },
  { href: "/main/music", label: "音乐", icon: Music },
  { href: "/main/image", label: "图片", icon: ImageIcon },
  { href: "/main/doc", label: "文档", icon: FileText },
  { href: "/main/other", label: "其他", icon: Package },
]

const otherMenus: NavItem[] = [
  { href: "/share", label: "我的分享", icon: Link2 },
  { href: "/recycle", label: "回收站", icon: Trash2 },
]

const adminMenu: NavItem = { href: "/admin", label: "管理后台", icon: Settings }

function SidebarLink({
  item,
  isActive,
  collapsed,
}: {
  item: NavItem
  isActive: boolean
  collapsed: boolean
}) {
  const linkContent = (
    <Link
      href={item.href}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200",
        collapsed && "justify-center px-2",
        isActive
          ? "bg-primary/10 text-primary"
          : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
      )}
    >
      <item.icon className="h-[18px] w-[18px] shrink-0" />
      <span
        className={cn(
          "whitespace-nowrap transition-all duration-200 overflow-hidden",
          collapsed ? "w-0 opacity-0" : "w-auto opacity-100"
        )}
      >
        {item.label}
      </span>
    </Link>
  )

  if (collapsed) {
    return (
      <Tooltip delayDuration={0}>
        <TooltipTrigger asChild>{linkContent}</TooltipTrigger>
        <TooltipContent side="right" sideOffset={8}>
          {item.label}
        </TooltipContent>
      </Tooltip>
    )
  }

  return linkContent
}

export function AppSidebar({ collapsed, currentPath }: AppSidebarProps) {
  const usedSpace = 512
  const totalSpace = 10240
  const usagePercent = (usedSpace / totalSpace) * 100

  const isActive = (href: string) => {
    if (href === "/main/all") {
      return (
        currentPath === href ||
        (currentPath.startsWith("/main") &&
          !fileCategories.slice(1).some(c => currentPath === c.href))
      )
    }
    return currentPath.startsWith(href)
  }

  return (
    <TooltipProvider>
      <aside
        className={cn(
          "flex h-screen flex-col border-r border-border bg-sidebar overflow-hidden",
          "transition-[width] duration-300 ease-in-out",
          collapsed ? "w-[60px]" : "w-[220px]"
        )}
        role="navigation"
        aria-label="主导航"
      >
        {/* Logo */}
        <div className="flex h-14 items-center border-b border-border px-3 shrink-0">
          <Link href="/main/all" className="flex items-center gap-2.5 overflow-hidden">
            <Cloud className="h-6 w-6 text-primary shrink-0" />
            <span
              className={cn(
                "text-lg font-bold text-sidebar-foreground tracking-tight whitespace-nowrap transition-all duration-300",
                collapsed ? "w-0 opacity-0 ml-0" : "w-auto opacity-100"
              )}
            >
              FlowPan
            </span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto overflow-x-hidden py-3 px-2">
          <div className="space-y-0.5">
            {fileCategories.map(item => (
              <SidebarLink
                key={item.href}
                item={item}
                isActive={isActive(item.href)}
                collapsed={collapsed}
              />
            ))}
          </div>

          <div className={cn("my-3 h-px bg-border transition-all duration-300", collapsed ? "mx-1" : "mx-3")} />

          <div className="space-y-0.5">
            {otherMenus.map(item => (
              <SidebarLink
                key={item.href}
                item={item}
                isActive={isActive(item.href)}
                collapsed={collapsed}
              />
            ))}
          </div>

          <div className={cn("my-3 h-px bg-border transition-all duration-300", collapsed ? "mx-1" : "mx-3")} />

          <SidebarLink
            item={adminMenu}
            isActive={isActive(adminMenu.href)}
            collapsed={collapsed}
          />
        </nav>

        {/* Storage */}
        <div className={cn(
          "border-t border-border shrink-0 transition-all duration-300",
          collapsed ? "px-2 py-3" : "px-4 py-4"
        )}>
          {collapsed ? (
            <Tooltip delayDuration={0}>
              <TooltipTrigger asChild>
                <div className="flex flex-col items-center gap-1 cursor-default">
                  <div className="h-1.5 w-8 rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full rounded-full bg-success transition-all"
                      style={{ width: `${usagePercent}%` }}
                    />
                  </div>
                </div>
              </TooltipTrigger>
              <TooltipContent side="right" sideOffset={8}>
                已使用 {usedSpace} MB / {(totalSpace / 1024).toFixed(0)} GB
              </TooltipContent>
            </Tooltip>
          ) : (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>存储空间</span>
                <span>{usedSpace} MB / {(totalSpace / 1024).toFixed(0)} GB</span>
              </div>
              <Progress value={usagePercent} className="h-1.5" />
            </div>
          )}
        </div>
      </aside>
    </TooltipProvider>
  )
}
