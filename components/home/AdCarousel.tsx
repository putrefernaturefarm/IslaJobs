'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import {
  Sprout, Truck, Wrench, Sparkles, Droplets, HeartHandshake,
  Laptop, Flower2, Briefcase, Rocket, MoreHorizontal,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

interface Slide {
  key: string
  title: string
  tagline: string
  Icon: LucideIcon
  gradient: string
  shadow: string
  href: string
}

const SLIDES: Slide[] = [
  { key: 'gardening',    title: 'Gardening & Agricultural', tagline: 'Lawn care, landscaping & farm work',  Icon: Sprout,         gradient: 'linear-gradient(135deg, #15803D 0%, #22C55E 60%, #4ADE80 100%)', shadow: 'rgba(34,197,94,0.38)',  href: '/jobs?q=gardening' },
  { key: 'delivery',     title: 'Delivery Services',      tagline: 'Fast, reliable pickup & drop-off',         Icon: Truck,          gradient: 'linear-gradient(135deg, #C2410C 0%, #EA580C 60%, #FB923C 100%)', shadow: 'rgba(234,88,12,0.38)',  href: '/jobs?q=delivery' },
  { key: 'handyman',     title: 'Handyman Services',      tagline: 'Repairs, fixes & home improvements',       Icon: Wrench,         gradient: 'linear-gradient(135deg, #1E3A8A 0%, #1565D8 60%, #2563EB 100%)', shadow: 'rgba(21,101,216,0.38)', href: '/jobs?q=handyman' },
  { key: 'cleaning',     title: 'Cleaning Services',      tagline: 'Spotless homes & offices, on demand',      Icon: Sparkles,       gradient: 'linear-gradient(135deg, #0F766E 0%, #14B8A6 60%, #5EEAD4 100%)', shadow: 'rgba(20,184,166,0.38)', href: '/jobs?q=cleaning' },
  { key: 'washing',      title: 'Washing Services',       tagline: 'Laundry, car wash & pressure washing',     Icon: Droplets,       gradient: 'linear-gradient(135deg, #0369A1 0%, #0EA5E9 60%, #7DD3FC 100%)', shadow: 'rgba(14,165,233,0.38)', href: '/jobs?q=washing' },
  { key: 'caregiving',   title: 'Caregiving Services',    tagline: 'Compassionate care for family & elders',   Icon: HeartHandshake, gradient: 'linear-gradient(135deg, #BE185D 0%, #E11D48 60%, #FB7185 100%)', shadow: 'rgba(225,29,72,0.38)',  href: '/jobs?q=caregiving' },
  { key: 'it',           title: 'IT Services',            tagline: 'Tech support, setup & troubleshooting',    Icon: Laptop,         gradient: 'linear-gradient(135deg, #3730A3 0%, #4F46E5 60%, #818CF8 100%)', shadow: 'rgba(79,70,229,0.38)',  href: '/jobs?q=it%20services' },
  { key: 'massage',      title: 'Massage Services',       tagline: 'Relaxing therapy, right at home',          Icon: Flower2,        gradient: 'linear-gradient(135deg, #6D28D9 0%, #8B5CF6 60%, #C4B5FD 100%)', shadow: 'rgba(139,92,246,0.38)', href: '/jobs?q=massage' },
  { key: 'consultancy',  title: 'Consultancy Services',   tagline: 'Expert advice for your next big move',     Icon: Briefcase,      gradient: 'linear-gradient(135deg, #1F2937 0%, #4B5563 60%, #9CA3AF 100%)', shadow: 'rgba(75,85,99,0.38)',   href: '/jobs?q=consultancy' },
  { key: 'drone',        title: 'Drone Services',         tagline: 'Aerial photos, mapping & inspections',     Icon: Rocket,         gradient: 'linear-gradient(135deg, #075985 0%, #0891B2 60%, #67E8F9 100%)', shadow: 'rgba(8,145,178,0.38)',  href: '/jobs?q=drone' },
  { key: 'other',        title: 'Extra & Other Services', tagline: "Something else? We've got you covered",   Icon: MoreHorizontal, gradient: 'linear-gradient(135deg, #92400E 0%, #D97706 60%, #FBBF24 100%)', shadow: 'rgba(217,119,6,0.38)',  href: '/jobs' },
]

const INTERVAL_MS = 5000

export function AdCarousel() {
  const [index, setIndex] = useState(0)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const touchStartX = useRef<number | null>(null)

  const restartTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current)
    timerRef.current = setInterval(() => {
      setIndex((i) => (i + 1) % SLIDES.length)
    }, INTERVAL_MS)
  }

  useEffect(() => {
    restartTimer()
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [])

  const goTo = (next: number) => {
    setIndex(((next % SLIDES.length) + SLIDES.length) % SLIDES.length)
    restartTimer()
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return
    const delta = e.changedTouches[0].clientX - touchStartX.current
    touchStartX.current = null
    if (delta > 40) goTo(index - 1)
    else if (delta < -40) goTo(index + 1)
  }

  return (
    <div className="flex flex-col gap-2.5">
      <div
        className="relative overflow-hidden rounded-[24px]"
        style={{ minHeight: 132 }}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div
          className="flex transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${index * 100}%)` }}
        >
          {SLIDES.map((slide) => (
            <Link key={slide.key} href={slide.href} className="w-full shrink-0">
              <div
                className="w-full px-5 py-5 flex items-center gap-3 relative overflow-hidden active:opacity-90"
                style={{ background: slide.gradient, boxShadow: `0 10px 32px ${slide.shadow}`, minHeight: 132 }}
              >
                <span style={{ position: 'absolute', width: 160, height: 140, background: 'rgba(255,255,255,0.08)', borderRadius: '60% 40% 70% 30% / 50% 60% 40% 50%', top: -35, right: -25, pointerEvents: 'none' }} />
                <span style={{ position: 'absolute', width: 95, height: 85, background: 'rgba(255,255,255,0.06)', borderRadius: '40% 60% 30% 70% / 60% 40% 60% 40%', bottom: -18, right: 45, pointerEvents: 'none' }} />
                <span style={{ position: 'absolute', width: 55, height: 55, background: 'rgba(255,255,255,0.05)', borderRadius: '50%', top: 12, right: 90, pointerEvents: 'none' }} />
                <div
                  className="w-14 h-14 rounded-[18px] flex items-center justify-center shrink-0 relative z-10"
                  style={{ background: 'rgba(255,255,255,0.18)', backdropFilter: 'blur(8px)' }}
                >
                  <slide.Icon size={26} color="#fff" strokeWidth={2} />
                </div>
                <div className="flex-1 relative z-10" style={{ maxWidth: '74%' }}>
                  <p className="text-white font-bold text-[20px] leading-tight">{slide.title}</p>
                  <p className="text-[12.5px] mt-0.5 leading-snug" style={{ color: 'rgba(255,255,255,0.78)' }}>
                    {slide.tagline}
                  </p>
                  <div
                    className="inline-flex items-center gap-1 px-3 py-1 rounded-full mt-2"
                    style={{ background: 'rgba(255,255,255,0.22)' }}
                  >
                    <span className="text-[12px] font-semibold text-white">Explore Now →</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
