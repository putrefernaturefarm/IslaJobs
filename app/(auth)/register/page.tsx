'use client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { createBrowserClient } from '@/lib/supabase/client'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { TopBar } from '@/components/layout/TopBar'
import { toStoragePhone, toAuthEmail } from '@/lib/utils'

const schema = z.object({
  first_name: z.string().min(2, 'First name is required'),
  last_name: z.string().min(2, 'Last name is required'),
  phone: z.string().regex(/^09\d{9}$/, 'Enter a valid 09XXXXXXXXX number'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Must contain at least one number'),
  confirm_password: z.string(),
}).refine((d) => d.password === d.confirm_password, {
  message: 'Passwords do not match',
  path: ['confirm_password'],
})

type FormValues = z.infer<typeof schema>

export default function RegisterPage() {
  const router = useRouter()
  const supabase = createBrowserClient()

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) })

  const onSubmit = async (values: FormValues) => {
    const phone = toStoragePhone(values.phone)
    const email = toAuthEmail(values.phone)

    const { data, error } = await supabase.auth.signUp({
      email,
      password: values.password,
      options: {
        data: { phone, first_name: values.first_name, last_name: values.last_name },
      },
    })

    if (error) {
      setError('root', { message: error.message })
      return
    }

    if (data.session) {
      window.location.href = '/home'
    } else {
      // "Confirm email" is ON in Supabase — try signing in directly since account was just created
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password: values.password,
      })
      if (signInError) {
        setError('root', {
          message: 'Account created! Go back to Sign in and log in with your phone and password.',
        })
      } else {
        window.location.href = '/home'
      }
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      <TopBar title="Create Account" onBack={() => router.push('/login')} />

      <div className="flex-1 pt-14 px-5 pb-6">
        <p className="text-[14px] text-[#6B6560] mt-6 mb-6">
          Join IslaJobs to find work or hire local workers in Dinagat Islands.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
          <div className="flex gap-3">
            <Input
              label="First Name"
              placeholder="Juan"
              autoComplete="given-name"
              error={errors.first_name?.message}
              {...register('first_name')}
            />
            <Input
              label="Last Name"
              placeholder="dela Cruz"
              autoComplete="family-name"
              error={errors.last_name?.message}
              {...register('last_name')}
            />
          </div>

          <Input
            label="Phone Number"
            placeholder="09XXXXXXXXX"
            inputMode="tel"
            autoComplete="tel"
            hint="We'll send a verification code to this number"
            error={errors.phone?.message}
            {...register('phone')}
          />

          <Input
            label="Password"
            type="password"
            placeholder="Create a password"
            autoComplete="new-password"
            hint="At least 8 characters, 1 uppercase, 1 number"
            error={errors.password?.message}
            {...register('password')}
          />

          <Input
            label="Confirm Password"
            type="password"
            placeholder="Repeat your password"
            autoComplete="new-password"
            error={errors.confirm_password?.message}
            {...register('confirm_password')}
          />

          {errors.root && (
            <p className="error-text text-center">{errors.root.message}</p>
          )}

          <Button
            type="submit"
            variant="primary"
            fullWidth
            loading={isSubmitting}
            className="mt-2"
          >
            Create Account
          </Button>
        </form>

        <p className="text-[12px] text-[#6B6560] text-center mt-5 px-2">
          By creating an account, you agree to our{' '}
          <Link href="/terms" className="text-[#1565D8]">Terms of Service</Link>
          {' '}and{' '}
          <Link href="/privacy" className="text-[#1565D8]">Privacy Policy</Link>.
        </p>

        <div className="text-center mt-4">
          <span className="text-[14px] text-[#6B6560]">Already have an account? </span>
          <Link href="/login" className="text-[14px] text-[#1565D8] font-semibold">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  )
}
