'use client'
import { Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { differenceInYears, parseISO } from 'date-fns'
import { createBrowserClient } from '@/lib/supabase/client'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { TopBar } from '@/components/layout/TopBar'

const schema = z.object({
  date_of_birth: z
    .string()
    .min(1, 'Date of birth is required')
    .refine((d) => {
      try {
        const age = differenceInYears(new Date(), parseISO(d))
        return age >= 18
      } catch {
        return false
      }
    }, { message: 'You must be at least 18 years old to work on IslaJobs' }),
  bio: z.string().min(20, 'Tell us at least a few words about yourself (20+ chars)').max(500),
  confirm: z.literal(true, {
    errorMap: () => ({ message: 'You must confirm you are at least 18 years old' }),
  }),
})

type FormValues = z.infer<typeof schema>

function WorkerSetupContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const isUpgrade = searchParams.get('upgrade') === '1'
  const supabase = createBrowserClient()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) })

  const onSubmit = async (values: FormValues) => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      router.replace('/login')
      return
    }

    const { data: profile } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single()

    const updates: { date_of_birth: string; bio: string; role?: 'both' } = {
      date_of_birth: values.date_of_birth,
      bio: values.bio,
    }
    // Upgrading an existing customer-only account to also work — grant worker access.
    if (profile?.role === 'customer') {
      updates.role = 'both'
    }

    await supabase.from('users').update(updates).eq('id', user.id)

    if (isUpgrade) {
      document.cookie = 'isla_view=worker; path=/; max-age=31536000; samesite=lax'
    }

    router.replace('/home')
  }

  return (
    <div className="flex flex-col min-h-screen">
      <TopBar title="Worker Profile" />

      <div className="flex-1 pt-14 px-5 pb-6">
        {isUpgrade && (
          <p className="text-[13px] font-semibold text-primary mb-2">
            Switching to a worker account
          </p>
        )}
        <p className="text-[14px] text-[#6B6560] mt-1 mb-6">
          To protect everyone on the platform, workers must be{' '}
          <span className="font-semibold text-[#1A1A1A]">at least 18 years old</span>.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
          <Input
            label="Date of Birth"
            type="date"
            hint="You must be 18 or older"
            error={errors.date_of_birth?.message}
            {...register('date_of_birth')}
          />

          <div className="w-full">
            <label className="form-label">About You</label>
            <textarea
              placeholder="Tell customers what skills you have, your experience, and the type of work you do..."
              className={[
                'input-field resize-none h-28',
                errors.bio ? 'border-[#E11D48]' : '',
              ].join(' ')}
              {...register('bio')}
            />
            {errors.bio && (
              <p className="error-text">{errors.bio.message}</p>
            )}
          </div>

          {/* 18+ confirmation checkbox */}
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              className="mt-0.5 w-5 h-5 accent-[#1565D8] shrink-0"
              {...register('confirm')}
            />
            <span className="text-[13px] text-[#1A1A1A] leading-relaxed">
              I confirm that I am at least 18 years old and understand that providing
              false information may result in account suspension.
            </span>
          </label>
          {errors.confirm && (
            <p className="error-text -mt-2">{errors.confirm.message}</p>
          )}

          <Button
            type="submit"
            variant="primary"
            fullWidth
            loading={isSubmitting}
            className="mt-2"
          >
            Set Up Profile
          </Button>
        </form>
      </div>
    </div>
  )
}

export default function WorkerSetupPage() {
  return (
    <Suspense>
      <WorkerSetupContent />
    </Suspense>
  )
}
