'use client'
import { useEffect, useRef, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Smartphone } from 'lucide-react'
import { createBrowserClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/Button'
import { TopBar } from '@/components/layout/TopBar'
import { toStoragePhone } from '@/lib/utils'

const OTP_LENGTH = 6
const RESEND_SECONDS = 60

export default function VerifyOtpPage() {
  const router = useRouter()
  const params = useSearchParams()
  const mode = params.get('mode') ?? 'login'
  const phoneParam = params.get('phone') ?? ''

  const supabase = createBrowserClient()

  const [digits, setDigits] = useState<string[]>(Array(OTP_LENGTH).fill(''))
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [countdown, setCountdown] = useState(RESEND_SECONDS)
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  useEffect(() => {
    inputRefs.current[0]?.focus()
  }, [])

  useEffect(() => {
    if (countdown <= 0) return
    const timer = setInterval(() => setCountdown((c) => c - 1), 1000)
    return () => clearInterval(timer)
  }, [countdown])

  const handleChange = (index: number, value: string) => {
    const digit = value.replace(/\D/g, '').slice(-1)
    const next = [...digits]
    next[index] = digit
    setDigits(next)
    setError('')

    if (digit && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus()
    }

    if (digit && index === OTP_LENGTH - 1) {
      const code = [...next.slice(0, OTP_LENGTH - 1), digit].join('')
      if (code.length === OTP_LENGTH) {
        verifyCode(code)
      }
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, OTP_LENGTH)
    const next = [...digits]
    for (let i = 0; i < pasted.length; i++) next[i] = pasted[i]
    setDigits(next)
    if (pasted.length === OTP_LENGTH) verifyCode(pasted)
    else inputRefs.current[pasted.length]?.focus()
  }

  const verifyCode = async (code: string) => {
    setLoading(true)
    setError('')
    const phone = toStoragePhone(phoneParam)

    const { error: verifyError } = await supabase.auth.verifyOtp({
      phone,
      token: code,
      type: 'sms',
    })

    if (verifyError) {
      setError('Invalid or expired code. Please try again.')
      setDigits(Array(OTP_LENGTH).fill(''))
      inputRefs.current[0]?.focus()
      setLoading(false)
      return
    }

    if (mode === 'register') {
      await completeRegistration()
    } else {
      router.replace('/home')
    }
    setLoading(false)
  }

  const completeRegistration = async () => {
    const raw = sessionStorage.getItem('pending_register')
    if (!raw) {
      router.replace('/home')
      return
    }
    const { phone, password, first_name, last_name } = JSON.parse(raw)

    // Update password
    await supabase.auth.updateUser({ password })

    // Get auth user
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      router.replace('/home')
      return
    }

    // Create profile (role selection comes next)
    await supabase.from('users').upsert({
      id: user.id,
      phone,
      first_name,
      last_name,
      role: 'customer', // default — user can add worker role later
    })

    sessionStorage.removeItem('pending_register')
    router.replace('/role-select')
  }

  const handleResend = async () => {
    const phone = toStoragePhone(phoneParam)
    await supabase.auth.signInWithOtp({ phone })
    setCountdown(RESEND_SECONDS)
    setDigits(Array(OTP_LENGTH).fill(''))
    setError('')
    inputRefs.current[0]?.focus()
  }

  const handleManualVerify = () => {
    const code = digits.join('')
    if (code.length === OTP_LENGTH) verifyCode(code)
  }

  const displayPhone = phoneParam || 'your phone'

  return (
    <div className="flex flex-col min-h-screen">
      <TopBar title="Verify Phone" />

      <div className="flex-1 pt-14 px-5 pb-6 flex flex-col">
        <div className="flex flex-col items-center mt-8 mb-8">
          <div className="w-16 h-16 rounded-full bg-[#E7F0FD] flex items-center justify-center mb-4">
            <Smartphone size={32} color="#1565D8" />
          </div>
          <h2 className="text-[20px] font-bold text-[#1A1A1A] text-center">
            Enter verification code
          </h2>
          <p className="text-[14px] text-[#6B6560] text-center mt-2 max-w-[280px]">
            We sent a 6-digit code to{' '}
            <span className="font-semibold text-[#1A1A1A]">{displayPhone}</span>
          </p>
        </div>

        {/* OTP input boxes */}
        <div className="flex justify-center gap-3 mb-6" onPaste={handlePaste}>
          {digits.map((digit, i) => (
            <input
              key={i}
              ref={(el) => { inputRefs.current[i] = el }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              className={[
                'w-12 h-14 text-center text-[22px] font-bold rounded-[12px] border-[1.5px] bg-white outline-none transition-colors',
                digit
                  ? 'border-[#1565D8] text-[#1565D8]'
                  : 'border-[#E4E0D8] text-[#1A1A1A]',
                'focus:border-[#1565D8]',
              ].join(' ')}
            />
          ))}
        </div>

        {error && (
          <p className="error-text text-center mb-4">{error}</p>
        )}

        <Button
          variant="primary"
          fullWidth
          loading={loading}
          onClick={handleManualVerify}
          disabled={digits.join('').length < OTP_LENGTH}
        >
          Verify
        </Button>

        <div className="text-center mt-5">
          {countdown > 0 ? (
            <p className="text-[14px] text-[#6B6560]">
              Resend code in{' '}
              <span className="font-semibold text-[#1A1A1A]">{countdown}s</span>
            </p>
          ) : (
            <button
              onClick={handleResend}
              className="text-[14px] text-[#1565D8] font-semibold"
            >
              Resend code
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
