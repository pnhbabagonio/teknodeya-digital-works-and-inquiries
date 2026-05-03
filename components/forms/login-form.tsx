// components/forms/login-form.tsx
'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import {
  AlertCircle,
  ArrowRight,
  Eye,
  EyeOff,
  Loader2,
  LockKeyhole,
  Mail,
  ShieldCheck,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { loginSchema, type LoginFormData } from '@/lib/validations/auth'
import { createClient } from '@/lib/supabase/client'
import { cn } from '@/lib/utils'

export function LoginForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: 'admin@teknodeya.ph',
      password: 'teknodeya2026',
    },
  })

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true)
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      })

      if (error) throw error

      router.push('/admin')
      router.refresh()
      toast.success('Logged in successfully')
    } catch {
      toast.error('Invalid credentials')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="rounded-card border border-primary/15 bg-primary/5 p-4 shadow-[0_0_30px_rgba(0,186,242,0.06)]">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-input bg-primary/10 text-primary">
            <ShieldCheck className="h-5 w-5" aria-hidden="true" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-text-primary">
              Protected admin access
            </p>
            <p className="mt-1 text-xs leading-5 text-text-muted">
              Use your Teknodeya administrator credentials.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email" className="text-text-primary">
            Email
          </Label>
          <div className="relative">
            <Mail
              className={cn(
                'pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2',
                errors.email ? 'text-red-400' : 'text-text-muted'
              )}
              aria-hidden="true"
            />
            <Input
              id="email"
              {...register('email')}
              type="email"
              autoComplete="email"
              placeholder="admin@teknodeya.ph"
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? 'email-error' : undefined}
              className={cn(
                'h-12 bg-background/50 pl-10 pr-4 text-base border-white/10 focus:bg-background/70',
                errors.email && 'border-red-500/80 focus:ring-red-500'
              )}
            />
          </div>
          {errors.email && (
            <p
              id="email-error"
              className="flex items-center gap-1.5 text-sm text-red-400"
            >
              <AlertCircle className="h-4 w-4" aria-hidden="true" />
              {errors.email.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="password" className="text-text-primary">
            Password
          </Label>
          <div className="relative">
            <LockKeyhole
              className={cn(
                'pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2',
                errors.password ? 'text-red-400' : 'text-text-muted'
              )}
              aria-hidden="true"
            />
            <Input
              id="password"
              {...register('password')}
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              placeholder="Enter password"
              aria-invalid={!!errors.password}
              aria-describedby={errors.password ? 'password-error' : undefined}
              className={cn(
                'h-12 bg-background/50 pl-10 pr-12 text-base border-white/10 focus:bg-background/70',
                errors.password && 'border-red-500/80 focus:ring-red-500'
              )}
            />
            <button
              type="button"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-input text-text-muted transition-colors hover:bg-white/5 hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              onClick={() => setShowPassword((visible) => !visible)}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" aria-hidden="true" />
              ) : (
                <Eye className="h-4 w-4" aria-hidden="true" />
              )}
            </button>
          </div>
          {errors.password && (
            <p
              id="password-error"
              className="flex items-center gap-1.5 text-sm text-red-400"
            >
              <AlertCircle className="h-4 w-4" aria-hidden="true" />
              {errors.password.message}
            </p>
          )}
        </div>
      </div>

      <Button
        type="submit"
        size="lg"
        className="group h-12 w-full gap-2 shadow-[0_0_24px_rgba(0,186,242,0.18)]"
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            Signing in...
          </>
        ) : (
          <>
            Sign in
            <ArrowRight
              className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
              aria-hidden="true"
            />
          </>
        )}
      </Button>

      <div className="rounded-input border border-white/5 bg-background/40 px-3 py-2 text-center">
        <p className="text-xs text-text-muted">
          Access is limited to authorized administrators.
        </p>
      </div>
    </form>
  )
}
