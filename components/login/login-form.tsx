"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Checkbox } from "@/components/ui/checkbox"
import { Mail, Lock, ShieldCheck, Github, Loader2, Eye, EyeOff } from "lucide-react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

interface LoginFormProps {
  onSwitchToRegister: () => void
  onSwitchToReset: () => void
}

function generateCaptcha(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789"
  return Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * chars.length)]).join("")
}

export function LoginForm({ onSwitchToRegister, onSwitchToReset }: LoginFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [captchaText, setCaptchaText] = useState("")
  const [form, setForm] = useState({ email: "", password: "", captcha: "" })
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    setCaptchaText(generateCaptcha())
  }, [])

  const refreshCaptcha = useCallback(() => {
    setCaptchaText(generateCaptcha())
    setForm(prev => ({ ...prev, captcha: "" }))
  }, [])

  const validate = useCallback(() => {
    const newErrors: Record<string, string> = {}
    if (!form.email) newErrors.email = "请输入邮箱"
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) newErrors.email = "邮箱格式不正确"
    if (!form.password) newErrors.password = "请输入密码"
    else if (form.password.length < 6) newErrors.password = "密码长度不能少于6位"
    if (!form.captcha) newErrors.captcha = "请输入验证码"
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }, [form])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    await new Promise(r => setTimeout(r, 1200))
    setLoading(false)
    toast.success("登录成功，欢迎回来")
    router.push("/main/all")
  }

  const clearError = (field: string) => {
    if (errors[field]) {
      setErrors(prev => {
        const next = { ...prev }
        delete next[field]
        return next
      })
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6" noValidate>
      <div className="space-y-1.5">
        <h2 className="text-2xl font-bold text-foreground tracking-tight">欢迎回来</h2>
        <p className="text-sm text-muted-foreground">登录您的 FlowPan 账号以继续</p>
      </div>

      <div className="space-y-4">
        {/* Email */}
        <div className="space-y-1.5">
          <Label htmlFor="login-email" className="text-sm font-medium text-foreground">邮箱地址</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="login-email"
              type="email"
              placeholder="name@example.com"
              className={cn("pl-10 h-10", errors.email && "border-destructive focus-visible:ring-destructive")}
              value={form.email}
              onChange={e => { setForm({ ...form, email: e.target.value }); clearError("email") }}
              autoComplete="email"
            />
          </div>
          {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
        </div>

        {/* Password */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <Label htmlFor="login-password" className="text-sm font-medium text-foreground">密码</Label>
            <button
              type="button"
              className="text-xs text-primary hover:text-primary/80 transition-colors"
              onClick={onSwitchToReset}
            >
              忘记密码?
            </button>
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="login-password"
              type={showPassword ? "text" : "password"}
              placeholder="请输入密码"
              className={cn("pl-10 pr-10 h-10", errors.password && "border-destructive focus-visible:ring-destructive")}
              value={form.password}
              onChange={e => { setForm({ ...form, password: e.target.value }); clearError("password") }}
              autoComplete="current-password"
            />
            <button
              type="button"
              tabIndex={-1}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? "隐藏密码" : "显示密码"}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {errors.password && <p className="text-xs text-destructive">{errors.password}</p>}
        </div>

        {/* Captcha */}
        <div className="space-y-1.5">
          <Label htmlFor="login-captcha" className="text-sm font-medium text-foreground">验证码</Label>
          <div className="flex gap-3">
            <div className="relative flex-1">
              <ShieldCheck className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="login-captcha"
                placeholder="请输入验证码"
                className={cn("pl-10 h-10", errors.captcha && "border-destructive focus-visible:ring-destructive")}
                value={form.captcha}
                onChange={e => { setForm({ ...form, captcha: e.target.value }); clearError("captcha") }}
                autoComplete="off"
              />
            </div>
            <button
              type="button"
              onClick={refreshCaptcha}
              className="h-10 w-[100px] rounded-md bg-muted border border-border flex items-center justify-center cursor-pointer select-none hover:bg-accent transition-colors overflow-hidden"
              aria-label="刷新验证码"
            >
              <svg width="90" height="34" viewBox="0 0 90 34" className="select-none">
                <defs>
                  <filter id="captchaFilter">
                    <feTurbulence baseFrequency="0.03" numOctaves="4" seed="2" />
                    <feDisplacementMap in="SourceGraphic" scale="2" />
                  </filter>
                </defs>
                <line x1="5" y1="10" x2="85" y2="24" stroke="currentColor" strokeWidth="0.5" opacity="0.15" className="text-muted-foreground" />
                <line x1="10" y1="28" x2="80" y2="8" stroke="currentColor" strokeWidth="0.5" opacity="0.15" className="text-muted-foreground" />
                <text
                  x="45"
                  y="23"
                  textAnchor="middle"
                  fontSize="18"
                  fontFamily="ui-monospace, monospace"
                  fontWeight="600"
                  letterSpacing="4"
                  className="fill-foreground"
                  filter="url(#captchaFilter)"
                >
                  {captchaText}
                </text>
              </svg>
            </button>
          </div>
          {errors.captcha && <p className="text-xs text-destructive">{errors.captcha}</p>}
        </div>

        {/* Remember me */}
        <div className="flex items-center gap-2">
          <Checkbox
            id="remember"
            checked={rememberMe}
            onCheckedChange={(v) => setRememberMe(v === true)}
          />
          <label htmlFor="remember" className="text-sm text-muted-foreground cursor-pointer select-none">
            记住登录状态
          </label>
        </div>
      </div>

      <Button type="submit" className="w-full h-10 font-medium" disabled={loading}>
        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        登录
      </Button>

      <div className="relative flex items-center">
        <Separator className="flex-1" />
        <span className="px-4 text-xs text-muted-foreground bg-background">或</span>
        <Separator className="flex-1" />
      </div>

      <Button type="button" variant="outline" className="w-full h-10">
        <Github className="mr-2 h-4 w-4" />
        使用 GitHub 登录
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        {'还没有账号? '}
        <button
          type="button"
          className="text-primary font-medium hover:text-primary/80 transition-colors"
          onClick={onSwitchToRegister}
        >
          立即注册
        </button>
      </p>
    </form>
  )
}
