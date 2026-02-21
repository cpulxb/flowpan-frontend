import Link from "next/link"
import { Cloud, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <div className="w-full max-w-md text-center">
        {/* Logo */}
        <Link href="/login" className="inline-flex items-center gap-2 text-primary mb-8">
          <Cloud className="h-7 w-7" />
          <span className="text-xl font-bold tracking-tight">FlowPan</span>
        </Link>

        {/* 404 Illustration */}
        <div className="relative mx-auto mb-6">
          <div className="text-[120px] font-extrabold leading-none text-muted/60 select-none">
            404
          </div>
        </div>

        <h1 className="text-2xl font-bold text-foreground text-balance">页面未找到</h1>
        <p className="mt-3 text-sm text-muted-foreground text-pretty leading-relaxed">
          您访问的页面不存在或已被移除，请检查链接是否正确
        </p>

        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Button asChild>
            <Link href="/main/all">
              <ArrowLeft className="mr-2 h-4 w-4" />
              返回文件
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/login">
              前往登录
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
