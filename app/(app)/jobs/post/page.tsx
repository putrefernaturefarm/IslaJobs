'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { postJobSchema } from '@/lib/validations/schemas'
import { z } from 'zod'
import { createBrowserClient } from '@/lib/supabase/client'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { TopBar } from '@/components/layout/TopBar'
import type { Category } from '@/types/database'

type FormValues = z.infer<typeof postJobSchema>

const PRICING_OPTIONS = [
  { value: 'fixed', label: 'Fixed Price' },
  { value: 'hourly', label: 'Per Hour' },
]

export default function PostJobPage() {
  const router = useRouter()
  const supabase = createBrowserClient()
  const [categories, setCategories] = useState<Category[]>([])

  useEffect(() => {
    supabase.from('categories').select('*').order('sort_order').then(({ data }) => {
      if (data) setCategories(data)
    })
  }, [])

  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(postJobSchema) })

  const pricingType = watch('pricing_type')

  const onSubmit = async (values: FormValues) => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      router.replace('/login')
      return
    }

    const { error } = await supabase.from('job_posts').insert({
      customer_id: user.id,
      title: values.title,
      description: values.description,
      category_slug: values.category_slug,
      pricing_type: values.pricing_type,
      budget_max: values.budget_max ?? null,
      address: values.address,
      workers_needed: values.workers_needed,
      scheduled_date: values.scheduled_date,
      skills_needed: values.skills_needed ?? [],
      what_is_included: values.what_is_included ?? [],
      estimated_hours: values.estimated_hours ?? null,
      start_time: values.start_time ?? null,
      end_time: values.end_time ?? null,
      status: 'open',
    })

    if (!error) {
      router.replace('/jobs')
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      <TopBar title="Post a Job" />

      <div className="flex-1 pt-14 px-4 pb-6">
        <p className="text-[14px] text-[#6B6560] mt-4 mb-5">
          Describe the job clearly so the right workers can apply.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
          <Input
            label="Job Title"
            placeholder="e.g. Plumber needed for bathroom repair"
            error={errors.title?.message}
            {...register('title')}
          />

          <div className="w-full">
            <label className="form-label">Description</label>
            <textarea
              placeholder="Describe the work in detail — location, materials needed, expected duration..."
              className={[
                'input-field resize-none h-32',
                errors.description ? 'border-[#E11D48]' : '',
              ].join(' ')}
              {...register('description')}
            />
            {errors.description && <p className="error-text">{errors.description.message}</p>}
          </div>

          {/* Category */}
          <div className="w-full">
            <label className="form-label">Category</label>
            <Controller
              name="category_slug"
              control={control}
              render={({ field }) => (
                <select
                  {...field}
                  className={['input-field bg-white', errors.category_slug ? 'border-[#E11D48]' : ''].join(' ')}
                >
                  <option value="">Select a category</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.slug}>{cat.name}</option>
                  ))}
                </select>
              )}
            />
            {errors.category_slug && <p className="error-text">{errors.category_slug.message}</p>}
          </div>

          {/* Pricing type */}
          <div className="w-full">
            <label className="form-label">Pricing Type</label>
            <div className="grid grid-cols-2 gap-2">
              {PRICING_OPTIONS.map((opt) => {
                const isSelected = pricingType === opt.value
                return (
                  <label
                    key={opt.value}
                    className={[
                      'flex items-center justify-center h-12 rounded-[12px] border-[1.5px] cursor-pointer text-[14px] font-medium transition-colors',
                      isSelected
                        ? 'border-[#1565D8] bg-[#E7F0FD] text-[#1565D8]'
                        : 'border-[#E4E0D8] bg-white text-[#6B6560]',
                    ].join(' ')}
                  >
                    <input
                      type="radio"
                      value={opt.value}
                      className="sr-only"
                      {...register('pricing_type')}
                    />
                    {opt.label}
                  </label>
                )
              })}
            </div>
            {errors.pricing_type && <p className="error-text">{errors.pricing_type.message}</p>}
          </div>

          {/* Budget */}
          <Input
            label="Max Budget (₱)"
            placeholder="2000"
            inputMode="numeric"
            error={errors.budget_max?.message}
            {...register('budget_max', { valueAsNumber: true })}
          />

          <Input
            label="Location / Address"
            placeholder="e.g. Barangay San Jose, Dinagat Islands"
            error={errors.address?.message}
            {...register('address')}
          />

          <Input
            label="Workers Needed"
            placeholder="1"
            inputMode="numeric"
            error={errors.workers_needed?.message}
            {...register('workers_needed', { valueAsNumber: true })}
          />

          <Input
            label="Scheduled Date"
            type="date"
            error={errors.scheduled_date?.message}
            {...register('scheduled_date')}
          />

          <Button
            type="submit"
            variant="primary"
            fullWidth
            loading={isSubmitting}
            className="mt-2"
          >
            Post Job
          </Button>
        </form>
      </div>
    </div>
  )
}
