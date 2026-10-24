'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createBrowserClient } from '@/lib/supabase/client'
import { TopBar } from '@/components/layout/TopBar'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'

export default function ChangePasswordPage() {
  const router = useRouter()
  const supabase = createBrowserClient()

  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleSave = async () => {
    setError('')
    setSuccess(false)

    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters.')
      return
    }
    if (!/[A-Z]/.test(newPassword) || !/[0-9]/.test(newPassword)) {
      setError('Password must contain at least one uppercase letter and one number.')
      return
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    setSaving(true)
    const { error: updateError } = await supabase.auth.updateUser({ password: newPassword })
    setSaving(false)

    if (updateError) {
      setError(updateError.message || 'Failed to update password. Please try again.')
      return
    }

    setSuccess(true)
    setNewPassword('')
    setConfirmPassword('')
  }

  return (
    <div className="flex flex-col min-h-screen">
      <TopBar title="Change Password" onBack={() => router.back()} />

      <div className="flex-1 pt-14 px-5 pb-6">
        <p className="text-[14px] text-text-secondary mt-5 mb-6">
          This updates the password used to sign in to IslaJobs.
        </p>

        <div className="flex flex-col gap-4">
          <Input
            label="New Password"
            type="password"
            placeholder="Create a new password"
            hint="At least 8 characters, 1 uppercase, 1 number"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            autoComplete="new-password"
          />
          <Input
            label="Confirm New Password"
            type="password"
            placeholder="Repeat your new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            autoComplete="new-password"
          />

          {error && <p className="error-text text-center">{error}</p>}
          {success && (
            <p className="text-[13px] text-success text-center mt-1">
              Password updated successfully.
            </p>
          )}

          <Button variant="primary" fullWidth loading={saving} onClick={handleSave} className="mt-2">
            Update Password
          </Button>
        </div>
      </div>
    </div>
  )
}
