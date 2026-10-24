'use client'
import { useState, useEffect } from 'react'
import { createBrowserClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/Button'
import { CheckCircle2 } from 'lucide-react'

interface Props {
  jobId: string
  workerId: string
}

export function ApplyJobButton({ jobId, workerId }: Props) {
  const supabase = createBrowserClient()
  const [status, setStatus] = useState<'idle' | 'applied' | 'loading'>('loading')

  useEffect(() => {
    supabase
      .from('bookings')
      .select('id')
      .eq('job_post_id', jobId)
      .eq('worker_id', workerId)
      .maybeSingle()
      .then(({ data }) => setStatus(data ? 'applied' : 'idle'))
  }, [jobId, workerId])

  const handleApply = async () => {
    setStatus('loading')
    const { error } = await supabase.from('bookings').insert({
      job_post_id: jobId,
      worker_id: workerId,
      status: 'pending',
    })
    setStatus(error ? 'idle' : 'applied')
  }

  if (status === 'applied') {
    return (
      <div className="flex items-center justify-center gap-2 h-[52px] rounded-full bg-[#E6F4EA] text-[#1A7F37] font-semibold text-[15px]">
        <CheckCircle2 size={20} />
        Application Sent
      </div>
    )
  }

  return (
    <Button
      variant="primary"
      fullWidth
      loading={status === 'loading'}
      onClick={handleApply}
      className="mt-3"
    >
      Apply for this Job
    </Button>
  )
}
