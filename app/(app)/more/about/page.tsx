import { redirect } from 'next/navigation'
import { createServerClient } from '@/lib/supabase/server'
import { TopBar } from '@/components/layout/TopBar'
import { Info } from 'lucide-react'

const SECTIONS: { heading: string; paragraphs: string[] }[] = [
  {
    heading: 'Overview',
    paragraphs: [
      'IslaJobs is a mobile service marketplace that connects customers in Dinagat Islands with local workers for everyday tasks such as cleaning, repairs, deliveries, handyman work, pet care, cooking, and more.',
      'IslaJobs helps customers find trustworthy help nearby, and helps workers get discovered, booked, and build a reputation using simple digital tools.',
    ],
  },
  {
    heading: 'Mission and Vision',
    paragraphs: [
      'Mission: Make it easy for Dinagat Islands residents to find reliable local help, and for skilled workers to find steady work — all in one simple app.',
      'Vision: Become the trusted local service platform for Dinagat Islands and the surrounding region, supporting livelihoods and helping communities get things done faster.',
    ],
  },
  {
    heading: 'What IslaJobs Offers',
    paragraphs: [
      'For customers: browse worker profiles, check verification status and credentials, message workers directly, book a worker, or post a job and let workers apply.',
      'For workers: build a public profile, add a gallery and licenses/credentials to stand out, get verified, browse and apply to job posts, chat with customers, and manage bookings.',
    ],
  },
  {
    heading: 'How IslaJobs Works',
    paragraphs: [
      'Direct Booking Flow:',
      '1. Customers browse worker profiles and message or book a worker directly, with job details and schedule.',
      '2. The worker accepts the booking.',
      '3. The worker completes the job, and the customer and worker arrange payment between themselves.',
      '4. The booking is marked complete in the app.',
      '',
      'Job Post Flow:',
      '1. Customers create a job post describing the work needed, schedule, and budget.',
      '2. Workers browse open job posts and apply.',
      '3. The customer reviews applicants and books a worker.',
      '4. The rest follows the same flow as a direct booking.',
    ],
  },
  {
    heading: 'Payments',
    paragraphs: [
      'IslaJobs does not process payments inside the app yet. Customers and workers agree on the payment method — cash, GCash, or another method — directly with each other when booking.',
      'Workers can save a payout method (GCash or Maya) on their profile for customers’ reference, in preparation for in-app payments in a future update.',
    ],
  },
  {
    heading: 'Safety and Trust',
    paragraphs: [
      'Workers can complete identity verification — a government ID and a Police Clearance — before being marked as a Verified Worker. Customers can see this status on every profile.',
      'Workers can also add licenses, TESDA certificates, and other credentials to their profile as additional trust signals.',
      'If something goes wrong, use the Help & Support page in the app to reach the IslaJobs team.',
    ],
  },
  {
    heading: 'Contact and Support',
    paragraphs: [
      'For help with your account, a booking, or anything else, use the Help & Support section in the app.',
    ],
  },
]

export default async function AboutPage() {
  const supabase = await createServerClient()
  const { data: { user: authUser } } = await supabase.auth.getUser()
  if (!authUser) redirect('/login')

  return (
    <div className="flex flex-col min-h-screen">
      <TopBar title="About IslaJobs" />

      <div className="flex-1 pt-14 px-4 pb-6 space-y-4">
        <div className="card !rounded-[20px] flex items-center gap-3.5 mt-4">
          <div
            className="w-12 h-12 rounded-[14px] flex items-center justify-center shrink-0"
            style={{ background: 'var(--color-success-light)' }}
          >
            <Info size={22} color="#16A34A" strokeWidth={1.8} />
          </div>
          <div>
            <p className="text-[16px] font-bold text-text-primary">IslaJobs</p>
            <p className="text-[13px] text-text-secondary">Local service marketplace</p>
          </div>
        </div>

        {SECTIONS.map((section) => (
          <div key={section.heading} className="card !rounded-[20px]">
            <h2 className="text-[15px] font-bold text-text-primary mb-2.5">{section.heading}</h2>
            <div className="flex flex-col gap-2.5">
              {section.paragraphs.map((p, i) =>
                p === '' ? null : (
                  <p key={i} className="text-[14px] text-text-secondary leading-relaxed">
                    {p}
                  </p>
                )
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
