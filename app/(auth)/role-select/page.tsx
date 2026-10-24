'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Users, Briefcase, CheckCircle2 } from 'lucide-react'
import { createBrowserClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/Button'
import type { UserRole } from '@/types/database'

const ROLES = [
  {
    value: 'customer' as UserRole,
    label: 'I need to hire',
    subtitle: 'Post jobs and find local workers',
    Icon: Users,
    bg: '#E7F0FD',
    color: '#1565D8',
  },
  {
    value: 'worker' as UserRole,
    label: 'I want to work',
    subtitle: 'Apply for jobs and earn money',
    Icon: Briefcase,
    bg: '#E6F4EA',
    color: '#1A7F37',
  },
  {
    value: 'both' as UserRole,
    label: 'Both',
    subtitle: 'Hire workers and also find work',
    Icon: CheckCircle2,
    bg: '#FFF3E0',
    color: '#E67E00',
  },
]

export default function RoleSelectPage() {
  const router = useRouter()
  const supabase = createBrowserClient()
  const [selected, setSelected] = useState<UserRole | null>(null)
  const [loading, setLoading] = useState(false)

  const handleContinue = async () => {
    if (!selected) return
    setLoading(true)

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      router.replace('/login')
      return
    }

    await supabase
      .from('users')
      .update({ role: selected })
      .eq('id', user.id)

    if (selected === 'worker' || selected === 'both') {
      router.replace('/worker-setup')
    } else {
      router.replace('/home')
    }
    setLoading(false)
  }

  return (
    <div className="flex flex-col min-h-screen px-5 pt-12 pb-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-display text-[28px] font-semibold text-[#1A1A1A] leading-tight">
          How will you use IslaJobs?
        </h1>
        <p className="text-[14px] text-[#6B6560] mt-2">
          You can always change this later in your profile settings.
        </p>
      </div>

      {/* Role cards */}
      <div className="flex flex-col gap-4 flex-1">
        {ROLES.map(({ value, label, subtitle, Icon, bg, color }) => {
          const isSelected = selected === value
          return (
            <button
              key={value}
              onClick={() => setSelected(value)}
              className={[
                'flex items-center gap-4 p-4 rounded-[20px] border-[2px] transition-all text-left w-full',
                isSelected
                  ? 'border-[#1565D8] bg-[#F2F7FE]'
                  : 'border-[#E4E0D8] bg-white',
              ].join(' ')}
            >
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center shrink-0"
                style={{ backgroundColor: bg }}
              >
                <Icon size={28} color={color} strokeWidth={2} />
              </div>
              <div className="flex-1">
                <p className={[
                  'text-[17px] font-semibold',
                  isSelected ? 'text-[#1565D8]' : 'text-[#1A1A1A]',
                ].join(' ')}>
                  {label}
                </p>
                <p className="text-[13px] text-[#6B6560] mt-0.5">{subtitle}</p>
              </div>
              {isSelected && (
                <CheckCircle2 size={22} color="#1565D8" strokeWidth={2.5} />
              )}
            </button>
          )
        })}
      </div>

      <div className="mt-6">
        <Button
          variant="primary"
          fullWidth
          disabled={!selected}
          loading={loading}
          onClick={handleContinue}
        >
          Continue
        </Button>
      </div>
    </div>
  )
}
