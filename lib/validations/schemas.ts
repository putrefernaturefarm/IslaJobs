import { z } from 'zod'

const philippinePhone = z
  .string()
  .refine((v) => /^09\d{9}$/.test(v), {
    message: 'Phone must start with 09 and be exactly 11 digits',
  })

export const loginSchema = z.object({
  phone: philippinePhone,
  password: z.string().min(8, 'Password must be at least 8 characters'),
})

export const registerSchema = z.object({
  first_name: z.string().min(1, 'First name is required').max(50),
  last_name: z.string().min(1, 'Last name is required').max(50),
  phone: philippinePhone,
  password: z.string().min(8, 'Password must be at least 8 characters'),
  role: z.enum(['customer', 'worker', 'both']),
})

export const workerProfileSchema = z.object({
  date_of_birth: z
    .string()
    .refine((dob) => {
      const birth = new Date(dob)
      const now = new Date()
      const age = now.getFullYear() - birth.getFullYear()
      return age >= 18
    }, { message: 'You must be at least 18 years old to register as a worker.' }),
  confirm_age: z.literal(true, { errorMap: () => ({ message: 'You must confirm you are 18+' }) }),
})

export const profileUpdateSchema = z.object({
  first_name: z.string().min(1).max(50),
  last_name: z.string().min(1).max(50),
  bio: z.string().max(1000).optional(),
  location_lat: z.number().optional(),
  location_lng: z.number().optional(),
})

export const otpSchema = z.object({
  otp: z.string().length(6, 'OTP must be 6 digits').regex(/^\d+$/, 'OTP must be numeric'),
})

export const postJobSchema = z.object({
  title: z.string().min(5, 'Title is too short').max(100, 'Title is too long'),
  description: z.string().min(20, 'Description is too short'),
  address: z.string().min(5, 'Address is required'),
  category_slug: z.string().min(1, 'Category is required'),
  skills_needed: z.array(z.string()).default([]),
  pricing_type: z.enum(['hourly', 'fixed']),
  budget_max: z.number().positive('Budget must be greater than 0'),
  workers_needed: z.number().int().min(1).max(20),
  scheduled_date: z.string().min(1, 'Date is required'),
  estimated_hours: z.number().positive().optional(),
  start_time: z.string().optional(),
  end_time: z.string().optional(),
  what_is_included: z.array(z.string()).default([]),
})

export const verificationSchema = z.object({
  id_type: z.string().min(1, 'ID type is required'),
  id_number: z.string().min(1, 'ID number is required'),
  police_clearance_ref: z.string().min(1, 'Reference number is required'),
  police_clearance_date: z.string().min(1, 'Date issued is required'),
})

export const payoutSchema = z.object({
  method: z.enum(['gcash', 'maya']),
  account_name: z.string().min(2, 'Account name is required'),
  account_number: z.string().min(10, 'Account number is required').max(15),
})

export const bookingApplySchema = z.object({
  worker_note: z.string().max(500).optional(),
})

export type LoginInput = z.infer<typeof loginSchema>
export type RegisterInput = z.infer<typeof registerSchema>
export type WorkerProfileInput = z.infer<typeof workerProfileSchema>
export type ProfileUpdateInput = z.infer<typeof profileUpdateSchema>
export type OtpInput = z.infer<typeof otpSchema>
export type PostJobInput = z.infer<typeof postJobSchema>
export type VerificationInput = z.infer<typeof verificationSchema>
export type PayoutInput = z.infer<typeof payoutSchema>
export type BookingApplyInput = z.infer<typeof bookingApplySchema>
