"use client"

import { useState, useCallback, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { User, Mail, Lock, ShieldCheck, Send, Loader2, Eye, EyeOff, Check, X } from "lucide-react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

interface RegisterFormProps {
  onSwitchToLogin: () => void
}

function generateCaptcha(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789"
  return Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * chars.length)]).join("")
}

function PasswordStrength({ password }: { password: string }) {
  const checks = [
    { label: "至少8个字符", met: password.length >= 8 },
    { label: "包含数字", met: /\d/.test(password) },
    { label: "包含字母", met: /[a-zA-Z]/.test(password) },
  ]
  if (!password) return null

  return (
    <div className="space-y-1.5 mt-2">
      {checks.map(check => (
        <div key={check.label} className="flex items-center gap-2 text-xs">
          {check.met ? (
            <Check className="h-3 w-3 text-success" />
          ) : (
            <X className="h-3 w-3 text-muted-foreground" />
          )}
          <span className={check.met ? "text-success" : "text-muted-foreground"}>
            {check.label}
          </span>
        </div>
      ))}
    </div>
  )
}

export function RegisterForm({ onSwitchToLogin }: RegisterFormProps) {
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [countdown, setCountdown] = useState(0)
  const [captchaText, setCaptchaText] = useState("")
  const [form, setForm] = useState({
    nickname: "",
    email: "",
    imageCaptcha: "",
    emailCode: "",
    password: "",
    confirmPassword: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    setCaptchaText(generateCaptcha())
  }, [])

  const refreshCaptcha = useCallback(() => {
    setCaptchaText(generateCaptcha())
    setForm(prev => ({ ...prev, imageCaptcha: "" }))
  }, [])

  const sendEmailCode = useCallback(async () => {
    const newErrors: Record<string, string> = {}
    if (!form.email) newErrors.email = "请输入邮箱"
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) newErrors.email = "邮箱格式不正确"
    if (!form.imageCaptcha) newErrors.imageCaptcha = "请先输入图形验证码"
    if (Object.keys(newErrors).length > 0) {
      setErrors(prev => ({ ...prev, ...newErrors }))
      return
    }
    setCountdown(60)
    toast.success("验证码已发送到您的邮箱")
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) { clearInterval(timer); return 0 }
        return prev - 1
      })
    }, 1000)
  }, [form.email, form.imageCaptcha])

  const validate = useCallback(() => {
    const newErrors: Record<string, string> = {}
    if (!form.nickname.trim()) newErrors.nickname = "请输入昵称"
    if (!form.email) newErrors.email = "请输入邮箱"
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) newErrors.email = "邮箱格式不正确"
    if (!form.emailCode) newErrors.emailCode = "请输入邮箱验证码"
    if (!form.password) newErrors.password = "请输入密码"
    else if (form.password.length < 8 || form.password.length > 18) newErrors.password = "密码长度需为8-18位"
    if (form.password !== form.confirmPassword) newErrors.confirmPassword = "两次密码不一致"
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }, [form])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    await new Promise(r => setTimeout(r, 1500))
    setLoading(false)
    toast.success("注册成功，请登录")
    onSwitchToLogin()
  }

  const updateField = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors(prev => { const n = { ...prev }; delete n[field]; return n })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      <div className="space-y-1.5">
        <h2 className="text-2xl font-bold text-foreground tracking-tight">创建账号</h2>
        <p className="text-sm text-muted-foreground">注册 FlowPan 开始安全存储</p>
      </div>

      <div className="space-y-3.5">
        {/* Nickname */}
        <div className="space-y-1.5">
          <Label className="text-sm font-medium text-foreground">昵称</Label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="您的昵称" className={cn("pl-10 h-10", errors.nickname && "border-destructive")} value={form.nickname} onChange={e => updateField("nickname", e.target.value)} />
          </div>
          {errors.nickname && <p className="text-xs text-destructive">{errors.nickname}</p>}
        </div>

        {/* Email */}
        <div className="space-y-1.5">
          <Label className="text-sm font-medium text-foreground">邮箱地址</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input type="email" placeholder="name@example.com" className={cn("pl-10 h-10", errors.email && "border-destructive")} value={form.email} onChange={e => updateField("email", e.target.value)} autoComplete="email" />
          </div>
          {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
        </div>

        {/* Image Captcha */}
        <div className="space-y-1.5">
          <Label className="text-sm font-medium text-foreground">图形验证码</Label>
          <div className="flex gap-3">
            <div className="relative flex-1">
              <ShieldCheck className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="请输入验证码" className={cn("pl-10 h-10", errors.imageCaptcha && "border-destructive")} value={form.imageCaptcha} onChange={e => updateField("imageCaptcha", e.target.value)} autoComplete="off" />
            </div>
            <button type="button" onClick={refreshCaptcha} className="h-10 w-[100px] rounded-md bg-muted border border-border flex items-center justify-center cursor-pointer select-none hover:bg-accent transition-colors">
              <svg width="90" height="34" viewBox="0 0 90 34">
                <line x1="5" y1="12" x2="85" y2="22" stroke="currentColor" strokeWidth="0.5" opacity="0.1" className="text-muted-foreground" />
                <text x="45" y="23" textAnchor="middle" fontSize="18" fontFamily="ui-monospace, monospace" fontWeight="600" letterSpacing="4" className="fill-foreground">{captchaText}</text>
              </svg>
            </button>
          </div>
          {errors.imageCaptcha && <p className="text-xs text-destructive">{errors.imageCaptcha}</p>}
        </div>

        {/* Email Code */}
        <div className="space-y-1.5">
          <Label className="text-sm font-medium text-foreground">邮箱验证码</Label>
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Send className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="6位数字验证码" className={cn("pl-10 h-10", errors.emailCode && "border-destructive")} value={form.emailCode} onChange={e => updateField("emailCode", e.target.value)} autoComplete="off" maxLength={6} />
            </div>
            <Button type="button" variant="outline" className="shrink-0 w-[100px] h-10 text-xs font-medium" disabled={countdown > 0} onClick={sendEmailCode}>
              {countdown > 0 ? `${countdown}s 后重发` : "发送验证码"}
            </Button>
          </div>
          {errors.emailCode && <p className="text-xs text-destructive">{errors.emailCode}</p>}
        </div>

        {/* Password */}
        <div className="space-y-1.5">
          <Label className="text-sm font-medium text-foreground">密码</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="8-18位密码"
              className={cn("pl-10 pr-10 h-10", errors.password && "border-destructive")}
              value={form.password}
              onChange={e => updateField("password", e.target.value)}
              autoComplete="new-password"
            />
            <button type="button" tabIndex={-1} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors" onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {errors.password && <p className="text-xs text-destructive">{errors.password}</p>}
          <PasswordStrength password={form.password} />
        </div>

        {/* Confirm Password */}
        <div className="space-y-1.5">
          <Label className="text-sm font-medium text-foreground">确认密码</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input type="password" placeholder="请再次输入密码" className={cn("pl-10 h-10", errors.confirmPassword && "border-destructive")} value={form.confirmPassword} onChange={e => updateField("confirmPassword", e.target.value)} autoComplete="new-password" />
          </div>
          {errors.confirmPassword && <p className="text-xs text-destructive">{errors.confirmPassword}</p>}
        </div>
      </div>

      <Button type="submit" className="w-full h-10 font-medium" disabled={loading}>
        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        创建账号
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        {'已有账号? '}
        <button type="button" className="text-primary font-medium hover:text-primary/80 transition-colors" onClick={onSwitchToLogin}>
          返回登录
        </button>
      </p>
    </form>
  )
}
