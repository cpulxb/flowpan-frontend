"use client"

import { useState, useEffect } from "react"
import { LoginForm } from "@/components/login/login-form"
import { RegisterForm } from "@/components/login/register-form"
import { ResetForm } from "@/components/login/reset-form"
import { Cloud, CheckCircle, Shield, Zap, Lock } from "lucide-react"
import { cn } from "@/lib/utils"

type Panel = "login" | "register" | "reset"

const features = [
  { icon: Zap, text: "大文件分片上传", desc: "支持GB级大文件稳定上传" },
  { icon: Shield, text: "断点续传", desc: "网络中断后自动恢复" },
  { icon: CheckCircle, text: "文件在线预览", desc: "支持主流文档/图片/视频格式" },
  { icon: Lock, text: "安全文件分享", desc: "加密链接 + 提取码保护" },
]

export default function LoginPage() {
  const [panel, setPanel] = useState<Panel>("login")
  const [transitioning, setTransitioning] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const switchPanel = (target: Panel) => {
    if (target === panel) return
    setTransitioning(true)
    setTimeout(() => {
      setPanel(target)
      setTransitioning(false)
    }, 150)
  }

  return (
    <div className="flex min-h-screen bg-background">
      {/* Left Brand Panel - only on md+ */}
      <div className="hidden lg:flex lg:w-[480px] xl:w-[560px] relative overflow-hidden items-center justify-center bg-primary">
        {/* Animated decorative elements */}
        <div className="absolute inset-0">
          <div className="absolute top-[10%] left-[5%] h-72 w-72 rounded-full bg-foreground/[0.03]" />
          <div className="absolute bottom-[15%] right-[8%] h-56 w-56 rounded-full bg-foreground/[0.06]" />
          <div className="absolute top-[55%] left-[35%] h-40 w-40 rounded-full bg-foreground/[0.04]" />
          <div className="absolute top-[5%] right-[20%] h-20 w-20 rounded-full bg-foreground/[0.05]" />
        </div>

        <div className={cn(
          "relative z-10 px-12 xl:px-16 max-w-lg transition-all duration-700",
          mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        )}>
          <div className="flex items-center gap-3 mb-10">
            <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-primary-foreground/20 backdrop-blur-sm">
              <Cloud className="h-7 w-7 text-primary-foreground" />
            </div>
            <h1 className="text-3xl font-bold text-primary-foreground tracking-tight">FlowPan</h1>
          </div>

          <p className="text-2xl text-primary-foreground/95 mb-3 font-semibold leading-relaxed">
            安全、便捷的
          </p>
          <p className="text-2xl text-primary-foreground/95 mb-10 font-semibold leading-relaxed">
            个人云存储服务
          </p>

          <div className="space-y-5">
            {features.map((feature, i) => (
              <div
                key={feature.text}
                className={cn(
                  "flex items-start gap-4 transition-all duration-500",
                  mounted ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4"
                )}
                style={{ transitionDelay: `${300 + i * 100}ms` }}
              >
                <div className="flex items-center justify-center h-9 w-9 rounded-lg bg-primary-foreground/15 shrink-0 mt-0.5">
                  <feature.icon className="h-4.5 w-4.5 text-primary-foreground" />
                </div>
                <div>
                  <p className="text-base font-medium text-primary-foreground">{feature.text}</p>
                  <p className="text-sm text-primary-foreground/60 mt-0.5">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Stats */}
          <div className="flex gap-8 mt-12 pt-8 border-t border-primary-foreground/10">
            {[
              { value: "99.9%", label: "可用性" },
              { value: "10GB", label: "免费空间" },
              { value: "256", label: "AES加密" },
            ].map(stat => (
              <div key={stat.label}>
                <p className="text-xl font-bold text-primary-foreground">{stat.value}</p>
                <p className="text-xs text-primary-foreground/50 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Form Panel */}
      <div className="flex flex-1 flex-col">
        {/* Mobile top bar */}
        <div className="flex items-center gap-2 px-6 py-5 lg:hidden">
          <Cloud className="h-6 w-6 text-primary" />
          <span className="text-lg font-bold text-foreground">FlowPan</span>
        </div>

        <div className="flex flex-1 items-center justify-center p-6 lg:p-12">
          <div
            className={cn(
              "w-full max-w-[420px] transition-all duration-150",
              transitioning ? "opacity-0 scale-[0.98]" : "opacity-100 scale-100"
            )}
          >
            {panel === "login" && (
              <LoginForm
                onSwitchToRegister={() => switchPanel("register")}
                onSwitchToReset={() => switchPanel("reset")}
              />
            )}
            {panel === "register" && (
              <RegisterForm onSwitchToLogin={() => switchPanel("login")} />
            )}
            {panel === "reset" && (
              <ResetForm onSwitchToLogin={() => switchPanel("login")} />
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 text-center">
          <p className="text-xs text-muted-foreground">
            {'FlowPan - '}
            <a href="#" className="hover:text-foreground transition-colors">服务条款</a>
            {' | '}
            <a href="#" className="hover:text-foreground transition-colors">隐私政策</a>
          </p>
        </div>
      </div>
    </div>
  )
}
