"use client"

import { useState, useCallback, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Mail, Lock, ShieldCheck, Send, Loader2, Eye, EyeOff, ArrowLeft } from "lucide-react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

interface ResetFormProps {
  onSwitchToLogin: () => void
}

function generateCaptcha(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789"
  return Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * chars.length)]).join("")
}

export function ResetForm({ onSwitchToLogin }: ResetFormProps) {
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [countdown, setCountdown] = useState(0)
  const [step, setStep] = useState<1 | 2>(1) // step 1: verify, step 2: new password
  const [captchaText, setCaptchaText] = useState("")
  const [form, setForm] = useState({
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
    if (!form.imageCaptcha) newErrors.imageCaptcha = "请输入图形验证码"
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

  const handleStepOne = () => {
    const newErrors: Record<string, string> = {}
    if (!form.email) newErrors.email = "请输入邮箱"
    if (!form.emailCode) newErrors.emailCode = "请输入验证码"
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }
    setStep(2)
    setErrors({})
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (step === 1) {
      handleStepOne()
      return
    }
    const newErrors: Record<string, string> = {}
    if (!form.password) newErrors.password = "请输入新密码"
    else if (form.password.length < 8 || form.password.length > 18) newErrors.password = "密码长度需为8-18位"
    if (form.password !== form.confirmPassword) newErrors.confirmPassword = "两次密码不一致"
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }
    setLoading(true)
    await new Promise(r => setTimeout(r, 1500))
    setLoading(false)
    toast.success("密码重置成功，请使用新密码登录")
    onSwitchToLogin()
  }

  const updateField = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors(prev => { const n = { ...prev }; delete n[field]; return n })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      <div className="space-y-1.5">
        <button
          type="button"
          className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-3"
          onClick={onSwitchToLogin}
        >
          <ArrowLeft className="h-4 w-4" />
          返回登录
        </button>
        <h2 className="text-2xl font-bold text-foreground tracking-tight">重置密码</h2>
        <p className="text-sm text-muted-foreground">
          {step === 1 ? "验证您的身份以重置密码" : "设置您的新密码"}
        </p>
      </div>

      {/* Step indicator */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 flex-1">
          <div className={cn(
            "h-8 w-8 rounded-full flex items-center justify-center text-sm font-medium shrink-0",
            "bg-primary text-primary-foreground"
          )}>1</div>
          <div className="h-0.5 flex-1 rounded bg-border overflow-hidden">
            <div className={cn("h-full bg-primary transition-all duration-500", step >= 2 ? "w-full" : "w-0")} />
          </div>
        </div>
        <div className="flex items-center gap-2 flex-1">
          <div className={cn(
            "h-8 w-8 rounded-full flex items-center justify-center text-sm font-medium shrink-0 transition-colors",
            step >= 2 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
          )}>2</div>
          <span className="text-xs text-muted-foreground hidden sm:inline">完成</span>
        </div>
      </div>

      {step === 1 ? (
        <div className="space-y-3.5">
          {/* Email */}
          <div className="space-y-1.5">
            <Label className="text-sm font-medium text-foreground">注册邮箱</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input type="email" placeholder="name@example.com" className={cn("pl-10 h-10", errors.email && "border-destructive")} value={form.email} onChange={e => updateField("email", e.target.value)} autoComplete="email" />
            </div>
            {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
          </div>

          {/* Captcha */}
          <div className="space-y-1.5">
            <Label className="text-sm font-medium text-foreground">图形验证码</Label>
            <div className="flex gap-3">
              <div className="relative flex-1">
                <ShieldCheck className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="请输入验证码" className={cn("pl-10 h-10", errors.imageCaptcha && "border-destructive")} value={form.imageCaptcha} onChange={e => updateField("imageCaptcha", e.target.value)} autoComplete="off" />
              </div>
              <button type="button" onClick={refreshCaptcha} className="h-10 w-[100px] rounded-md bg-muted border border-border flex items-center justify-center cursor-pointer select-none hover:bg-accent transition-colors">
                <svg width="90" height="34" viewBox="0 0 90 34">
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
              <Button type="button" variant="outline" className="shrink-0 w-[100px] h-10 text-xs" disabled={countdown > 0} onClick={sendEmailCode}>
                {countdown > 0 ? `${countdown}s` : "发送验证码"}
              </Button>
            </div>
            {errors.emailCode && <p className="text-xs text-destructive">{errors.emailCode}</p>}
          </div>
        </div>
      ) : (
        <div className="space-y-3.5">
          {/* New Password */}
          <div className="space-y-1.5">
            <Label className="text-sm font-medium text-foreground">新密码</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="8-18位新密码"
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
          </div>

          {/* Confirm */}
          <div className="space-y-1.5">
            <Label className="text-sm font-medium text-foreground">确认新密码</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input type="password" placeholder="请再次输入新密码" className={cn("pl-10 h-10", errors.confirmPassword && "border-destructive")} value={form.confirmPassword} onChange={e => updateField("confirmPassword", e.target.value)} autoComplete="new-password" />
            </div>
            {errors.confirmPassword && <p className="text-xs text-destructive">{errors.confirmPassword}</p>}
          </div>
        </div>
      )}

      <Button type="submit" className="w-full h-10 font-medium" disabled={loading}>
        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {step === 1 ? "下一步" : "重置密码"}
      </Button>
    </form>
  )
}
