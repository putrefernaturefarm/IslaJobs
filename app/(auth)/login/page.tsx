'use client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { createBrowserClient } from '@/lib/supabase/client'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { ThemeToggle } from '@/components/ui/ThemeToggle'
import { toAuthEmail } from '@/lib/utils'

const schema = z.object({
  phone: z.string().regex(/^09\d{9}$/, 'Enter a valid 09XXXXXXXXX number'),
  password: z.string().min(1, 'Password is required'),
})
type FormValues = z.infer<typeof schema>

export default function LoginPage() {
  const router = useRouter()
  const supabase = createBrowserClient()

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) })

  const onSubmit = async (values: FormValues) => {
    const email = toAuthEmail(values.phone)
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password: values.password,
    })
    if (error) {
      const msg = error.message.toLowerCase().includes('email not confirmed')
        ? 'Your account is not yet confirmed. Please contact support or try registering again.'
        : error.message || 'Incorrect phone number or password.'
      setError('root', { message: msg })
      return
    }
    window.location.href = '/home'
  }

  const handleSmsLogin = () => {
    router.push('/verify-otp?mode=login')
  }

  return (
    <div className="relative flex-1 flex flex-col overflow-hidden" style={{ background: 'var(--color-bg-page)' }}>
      {/* Brand panel */}
      <div
        className="relative px-5 pt-16 pb-16 overflow-hidden"
        style={{
          background: '#0766FF',
        }}
      >
        <div className="absolute top-4 right-4 z-20">
          <ThemeToggle />
        </div>
        <span
          className="absolute rounded-full pointer-events-none"
          style={{ width: 180, height: 180, background: 'rgba(255,255,255,0.07)', top: -70, right: -40 }}
        />
        <span
          className="absolute pointer-events-none"
          style={{
            width: 120, height: 100, background: 'rgba(255,255,255,0.06)',
            borderRadius: '60% 40% 70% 30% / 50% 60% 40% 50%', bottom: -30, left: -20,
          }}
        />
        <div className="relative z-10 flex flex-col items-center text-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/brand/login-logo.png" alt="IslaJobs" className="w-64 h-auto mb-1" />
          <p className="text-[13px]" style={{ color: 'rgba(255,255,255,0.78)' }}>
            Find work. Hire help. Right here on the island.
          </p>
        </div>
      </div>

      {/* Form card — overlaps the brand panel for depth */}
      <div className="flex-1 flex flex-col px-5 pb-6" style={{ marginTop: -36 }}>
        <div className="card-elevated bg-bg-card flex flex-col gap-4 relative z-10">
          <div>
            <h2 className="font-display text-[22px] font-semibold text-text-primary leading-tight">
              Welcome back
            </h2>
            <p className="text-[13px] text-text-secondary mt-0.5">
              Sign in to your IslaJobs account
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
            <Input
              label="Phone Number"
              placeholder="09XXXXXXXXX"
              inputMode="tel"
              autoComplete="tel"
              error={errors.phone?.message}
              {...register('phone')}
            />
            <Input
              label="Password"
              type="password"
              placeholder="Enter your password"
              autoComplete="current-password"
              error={errors.password?.message}
              {...register('password')}
            />

            {errors.root && (
              <p className="error-text text-center">{errors.root.message}</p>
            )}

            <Button
              type="submit"
              variant="primary"
              fullWidth
              loading={isSubmitting}
              className="mt-1"
            >
              Sign in
            </Button>
          </form>

          <div className="text-right">
            <Link
              href="/forgot-password"
              className="text-[13px] text-primary font-medium"
            >
              Forgot password?
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <div className="divider" />
            <span className="text-[13px] text-text-secondary font-medium">OR</span>
            <div className="divider" />
          </div>

          <Button
            type="button"
            variant="secondary"
            fullWidth
            onClick={handleSmsLogin}
          >
            Sign in with SMS code
          </Button>
        </div>

        <div className="mt-6 text-center">
          <span className="text-[14px] text-text-secondary">Don&apos;t have an account? </span>
          <Link href="/register" className="text-[14px] text-primary font-semibold">
            Create account
          </Link>
        </div>
      </div>
    </div>
  )
}
