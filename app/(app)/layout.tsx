"use client"

import { useState, useCallback, useEffect } from "react"
import { usePathname } from "next/navigation"
import { AppSidebar } from "@/components/app-sidebar"
import { AppHeader } from "@/components/app-header"
import { UploadPanel } from "@/components/upload-panel"
import { SettingsModal } from "@/components/modals/settings-modal"

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [mounted, setMounted] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [showUploadPanel, setShowUploadPanel] = useState(false)
  const [uploadTasks, setUploadTasks] = useState<
    { id: string; name: string; progress: number; status: "waiting" | "hashing" | "uploading" | "success" | "seconds" | "fail" }[]
  >([])

  useEffect(() => {
    setMounted(true)
  }, [])

  const toggleSidebar = useCallback(() => {
    setSidebarCollapsed(prev => !prev)
  }, [])

  const activeUploadCount = uploadTasks.filter(
    t => t.status === "uploading" || t.status === "hashing" || t.status === "waiting"
  ).length
  const completedUploadCount = uploadTasks.filter(
    t => t.status === "success" || t.status === "seconds"
  ).length

  const currentPath = mounted ? pathname : ""

  const simulateUpload = useCallback((files: FileList) => {
    const newTasks = Array.from(files).map((file, i) => ({
      id: `upload-${Date.now()}-${i}`,
      name: file.name,
      progress: 0,
      status: "waiting" as const,
    }))
    setUploadTasks(prev => [...prev, ...newTasks])
    setShowUploadPanel(true)

    newTasks.forEach((task, index) => {
      setTimeout(() => {
        setUploadTasks(prev =>
          prev.map(t => (t.id === task.id ? { ...t, status: "hashing" } : t))
        )
        setTimeout(() => {
          setUploadTasks(prev =>
            prev.map(t => (t.id === task.id ? { ...t, status: "uploading" } : t))
          )
          let progress = 0
          const interval = setInterval(() => {
            progress += Math.random() * 15 + 5
            if (progress >= 100) {
              progress = 100
              clearInterval(interval)
              setUploadTasks(prev =>
                prev.map(t =>
                  t.id === task.id
                    ? { ...t, progress: 100, status: index === 0 ? "seconds" : "success" }
                    : t
                )
              )
            } else {
              setUploadTasks(prev =>
                prev.map(t =>
                  t.id === task.id ? { ...t, progress: Math.min(progress, 99) } : t
                )
              )
            }
          }, 400)
        }, 600)
      }, index * 600)
    })
  }, [])

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Desktop Sidebar */}
      <div className="hidden md:block shrink-0">
        <AppSidebar
          collapsed={sidebarCollapsed}
          currentPath={currentPath}
        />
      </div>

      {/* Main Content */}
      <div className="flex flex-1 flex-col min-w-0">
        <AppHeader
          onToggleSidebar={toggleSidebar}
          sidebarCollapsed={sidebarCollapsed}
          onOpenSettings={() => setShowSettings(true)}
          activeUploadCount={activeUploadCount}
          totalUploadCount={uploadTasks.length}
          completedUploadCount={completedUploadCount}
          onToggleUploadPanel={() => setShowUploadPanel(!showUploadPanel)}
          onUploadFiles={(files) => simulateUpload(files)}
          onUploadFolder={(files) => simulateUpload(files)}
        />

        <main className="flex-1 overflow-auto">
          {children}
        </main>

        {/* Mobile Bottom Nav */}
        <MobileNav currentPath={currentPath} />
      </div>

      {/* Upload Panel */}
      {showUploadPanel && (
        <UploadPanel
          tasks={uploadTasks}
          onClose={() => setShowUploadPanel(false)}
          onClear={() =>
            setUploadTasks(prev =>
              prev.filter(t => t.status === "uploading" || t.status === "waiting" || t.status === "hashing")
            )
          }
        />
      )}

      {/* Settings Modal */}
      <SettingsModal open={showSettings} onOpenChange={setShowSettings} />
    </div>
  )
}

function MobileNav({ currentPath }: { currentPath: string }) {
  const items = [
    { href: "/main/all", label: "文件", icon: FolderIcon },
    { href: "/share", label: "分享", icon: LinkIcon },
    { href: "/recycle", label: "回收站", icon: TrashIcon },
    { href: "/admin", label: "管理", icon: SettingsIcon },
  ]

  return (
    <nav className="flex md:hidden border-t border-border bg-background shrink-0" role="navigation" aria-label="底部导航">
      {items.map(item => {
        const isActive = currentPath.startsWith(item.href)
        const Icon = item.icon
        return (
          <a
            key={item.href}
            href={item.href}
            className={`flex flex-1 flex-col items-center gap-1 py-2 text-xs transition-colors ${
              isActive ? "text-primary" : "text-muted-foreground"
            }`}
          >
            <Icon className="h-5 w-5" />
            <span>{item.label}</span>
          </a>
        )
      })}
    </nav>
  )
}

function FolderIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z" />
    </svg>
  )
}

function LinkIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </svg>
  )
}

function TrashIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
    </svg>
  )
}

function SettingsIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" /><circle cx="12" cy="12" r="3" />
    </svg>
  )
}
