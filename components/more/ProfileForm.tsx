'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Camera, MapPin, CheckCircle2, Lock } from 'lucide-react'
import { createBrowserClient } from '@/lib/supabase/client'
import type { User } from '@/types/database'
import { Avatar } from '@/components/ui/Avatar'

interface Props {
  profile: User
  isNameLocked: boolean
}

export default function ProfileForm({ profile, isNameLocked }: Props) {
  const router = useRouter()
  const supabase = createBrowserClient()

  const [firstName, setFirstName] = useState(profile.first_name)
  const [lastName, setLastName] = useState(profile.last_name)
  const [phone, setPhone] = useState(profile.phone ?? '')
  const [email, setEmail] = useState(profile.email ?? '')
  const [bio, setBio] = useState(profile.bio ?? '')
  const [locationLat, setLocationLat] = useState(profile.location_lat ?? null)
  const [locationLng, setLocationLng] = useState(profile.location_lng ?? null)
  const [barangay, setBarangay] = useState((profile as any).barangay ?? '')
  const [city, setCity] = useState((profile as any).city ?? '')
  const [province, setProvince] = useState((profile as any).province ?? 'Dinagat Islands')
  const [country, setCountry] = useState((profile as any).country ?? 'Philippines')

  const [saving, setSaving] = useState(false)
  const [locating, setLocating] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const bioCharsLeft = 1000 - bio.length

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError('Location is not supported on this device.')
      return
    }

    setLocating(true)
    setError('')

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocationLat(position.coords.latitude)
        setLocationLng(position.coords.longitude)
        setLocating(false)
      },
      () => {
        setLocating(false)
        setError('Could not get your location. Check location permissions and try again.')
      },
      { enableHighAccuracy: true, timeout: 10000 }
    )
  }

  const handleSave = async () => {
    if (!isNameLocked && (!firstName.trim() || !lastName.trim())) {
      setError('First and last name are required.')
      return
    }

    setSaving(true)
    setError('')
    setSuccess(false)

    const updates: Record<string, unknown> = {
      phone: phone.trim() || null,
      email: email.trim() || null,
      bio: bio.trim() || null,
      location_lat: locationLat,
      location_lng: locationLng,
      barangay: barangay.trim() || null,
      city: city.trim() || null,
      province: province.trim() || null,
      country: country.trim() || null,
    }
    if (!isNameLocked) {
      updates.first_name = firstName.trim()
      updates.last_name = lastName.trim()
    }

    const { error: updateError } = await supabase
      .from('users')
      .update(updates)
      .eq('id', profile.id)

    setSaving(false)

    if (updateError) {
      setError(
        updateError.message?.includes('column')
          ? 'Some fields (like Barangay/City/Province/Country) are not yet supported by the database — the rest of your changes were not saved either. Ask your developer to add those columns.'
          : 'Failed to save profile. Please try again.'
      )
    } else {
      setSuccess(true)
      router.refresh()
    }
  }

  return (
    <div className="min-h-screen bg-[var(--color-bg-page)]">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-[var(--color-bg-card)] border-b border-[var(--color-border)] px-4 py-4 flex items-center gap-3">
        <button
          onClick={() => router.back()}
          className="p-1 -ml-1 text-primary active:opacity-70"
          aria-label="Go back"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="text-xl font-bold text-text-primary">Edit Profile</h1>
      </div>

      <div className="px-4 py-6 space-y-6">
        {/* Avatar */}
        <div className="flex flex-col items-center gap-3 bg-[var(--color-bg-card)] rounded-2xl px-4 py-6">
          <Link href="/more/profile/photo" className="relative">
            <Avatar
              src={profile.profile_photo_url}
              firstName={profile.first_name}
              lastName={profile.last_name}
              size={80}
            />
            <span
              className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-primary flex items-center justify-center border-2 border-[var(--color-bg-card)]"
              aria-hidden="true"
            >
              <Camera size={15} color="#fff" strokeWidth={2} />
            </span>
          </Link>
          <p className="text-base font-bold text-text-primary">
            {profile.first_name} {profile.last_name}
          </p>
        </div>

        {/* Name-lock notice */}
        {isNameLocked && (
          <div className="flex items-start gap-3 px-4 py-3.5 rounded-xl" style={{ background: 'var(--color-bg-sunken)' }}>
            <Lock size={16} className="text-text-secondary mt-0.5 shrink-0" strokeWidth={2} />
            <p className="text-[13px] text-text-secondary leading-snug">
              Your name is locked after verification. Contact support to request a change.
            </p>
          </div>
        )}

        {/* Form */}
        <div className="bg-[var(--color-bg-card)] rounded-2xl px-4 py-5 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wide mb-1.5">
              First Name
            </label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              disabled={isNameLocked}
              className="w-full border border-border rounded-xl px-4 py-3 text-sm text-text-primary bg-[var(--color-bg-card)] outline-none focus:border-primary transition-colors disabled:opacity-60"
              placeholder="First name"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wide mb-1.5">
              Last Name
            </label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              disabled={isNameLocked}
              className="w-full border border-border rounded-xl px-4 py-3 text-sm text-text-primary bg-[var(--color-bg-card)] outline-none focus:border-primary transition-colors disabled:opacity-60"
              placeholder="Last name"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wide mb-1.5">
              Contact Number
            </label>
            <p className="text-xs text-text-secondary mb-1.5">
              Use a number you can be reached on for booking updates and SMS.
            </p>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full border border-border rounded-xl px-4 py-3 text-sm text-text-primary bg-[var(--color-bg-card)] outline-none focus:border-primary transition-colors"
              placeholder="09XXXXXXXXX"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wide mb-1.5">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-border rounded-xl px-4 py-3 text-sm text-text-primary bg-[var(--color-bg-card)] outline-none focus:border-primary transition-colors"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wide mb-1.5">
              Short Bio
            </label>
            <p className="text-xs text-text-secondary mb-1.5">
              Short bio: {bioCharsLeft} characters left (max 1000).
            </p>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value.slice(0, 1000))}
              rows={5}
              maxLength={1000}
              className="w-full border border-border rounded-xl px-4 py-3 text-sm text-text-primary bg-[var(--color-bg-card)] outline-none focus:border-primary transition-colors resize-none"
              placeholder="Tell others about yourself…"
            />
          </div>
        </div>

        {/* Location */}
        <div className="bg-[var(--color-bg-card)] rounded-2xl px-4 py-5 space-y-4">
          <div>
            <p className="text-xs font-semibold text-text-secondary uppercase tracking-wide mb-2">
              Location
            </p>
            <div className="flex items-center justify-between gap-3 flex-wrap">
              {locationLat && locationLng ? (
                <div className="flex items-center gap-2 text-success">
                  <CheckCircle2 size={16} strokeWidth={2} />
                  <span className="text-sm font-medium">
                    GPS: {locationLat.toFixed(4)}, {locationLng.toFixed(4)}
                  </span>
                </div>
              ) : (
                <p className="text-sm text-text-secondary">Not set</p>
              )}
              <button
                type="button"
                onClick={handleUseCurrentLocation}
                disabled={locating}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-success-light text-success text-sm font-semibold disabled:opacity-60"
              >
                <MapPin size={14} strokeWidth={2} />
                {locating ? 'Getting location…' : 'Use current location'}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wide mb-1.5">
              Barangay / Area
            </label>
            <input
              type="text"
              value={barangay}
              onChange={(e) => setBarangay(e.target.value)}
              className="w-full border border-border rounded-xl px-4 py-3 text-sm text-text-primary bg-[var(--color-bg-card)] outline-none focus:border-primary transition-colors"
              placeholder="e.g. Cuarinta"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wide mb-1.5">
              City / Municipality
            </label>
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full border border-border rounded-xl px-4 py-3 text-sm text-text-primary bg-[var(--color-bg-card)] outline-none focus:border-primary transition-colors"
              placeholder="e.g. San Jose"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wide mb-1.5">
              Province
            </label>
            <input
              type="text"
              value={province}
              onChange={(e) => setProvince(e.target.value)}
              className="w-full border border-border rounded-xl px-4 py-3 text-sm text-text-primary bg-[var(--color-bg-card)] outline-none focus:border-primary transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wide mb-1.5">
              Country
            </label>
            <input
              type="text"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="w-full border border-border rounded-xl px-4 py-3 text-sm text-text-primary bg-[var(--color-bg-card)] outline-none focus:border-primary transition-colors"
            />
          </div>
        </div>

        {/* Feedback */}
        {error && (
          <div className="bg-error-light rounded-xl px-4 py-3">
            <p className="text-sm text-error">{error}</p>
          </div>
        )}
        {success && (
          <div className="bg-success-light rounded-xl px-4 py-3">
            <p className="text-sm text-success">Profile updated successfully.</p>
          </div>
        )}

        {/* Save button */}
        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full bg-primary text-white font-semibold py-3.5 rounded-full text-sm active:opacity-90 disabled:opacity-60 transition-colors"
        >
          {saving ? 'Saving…' : 'Save profile'}
        </button>
      </div>
    </div>
  )
}
