import { TopBar } from '@/components/layout/TopBar'
import { FileText } from 'lucide-react'

const LAST_UPDATED = '2026-10-24'
const SUPPORT_EMAIL = 'support@islajobs.ph'

const SECTIONS: { heading: string; paragraphs: string[] }[] = [
  {
    heading: '1. Acceptance of Terms',
    paragraphs: [
      'By creating an account or using IslaJobs, you agree to these Terms of Service. IslaJobs is a mobile service marketplace serving the Dinagat Islands community.',
    ],
  },
  {
    heading: '2. Definitions',
    paragraphs: [
      '• "Customer" means a user who books a worker directly or posts a job.',
      '• "Worker" means a user who offers services, accepts bookings, or applies to job posts.',
      '• "Booking" means a confirmed arrangement between a Customer and a Worker for a specific job.',
      '• "Job Post" means a job listing created by a Customer that Workers can browse and apply to.',
    ],
  },
  {
    heading: '3. Platform Role (Marketplace)',
    paragraphs: [
      'IslaJobs is a mobile marketplace platform that connects Customers with independent Workers.',
      'IslaJobs is not an employment placement agency and does not recruit, hire, or place workers into employment relationships.',
      'Workers are not employees, agents, or representatives of IslaJobs. Customers and Workers enter into a direct service relationship with each other.',
      'IslaJobs provides in-app tools for booking, job posts, and messaging, but IslaJobs does not perform the services offered by Workers.',
    ],
  },
  {
    heading: '4. User Eligibility and Account Security',
    paragraphs: [
      'You must be at least 18 years old and legally capable of entering into contracts to use IslaJobs.',
      'You may optionally add a profile photo to help other users recognize you. You are responsible for ensuring any photo you add accurately represents you.',
      'You are responsible for maintaining the confidentiality of your login credentials and for all activities that occur under your account.',
    ],
  },
  {
    heading: '5. Worker Obligations',
    paragraphs: [
      'Workers agree to:',
      '• Keep their profile, bio, and availability accurate.',
      '• Provide honest and accurate information in job post applications, including cover messages.',
      '• Deliver services in a professional and safe manner, consistent with the agreed booking scope.',
      '• Communicate clearly and promptly regarding timing, scope, and requirements.',
      '• Comply with applicable laws, licensing requirements, and safety standards relevant to the services offered.',
      '• Ensure that any licenses and credentials submitted to the platform are genuine and up to date.',
    ],
  },
  {
    heading: '6. Customer Obligations',
    paragraphs: [
      'Customers agree to:',
      '• Provide accurate job descriptions, schedule details, and necessary instructions — whether for direct bookings or job posts.',
      '• Provide a safe environment for the requested work and comply with applicable laws and safety standards.',
      '• Treat Workers with respect and avoid harassment, discrimination, or unsafe requests.',
    ],
  },
  {
    heading: '7. Job Posts and Applications',
    paragraphs: [
      'Customers may create job posts describing work they need done. Workers may browse these posts and submit applications including a cover message.',
      'Submitting an application does not guarantee a booking. Customers review applications and choose which worker to book.',
      'Job post details must accurately represent the work required. Misleading job posts may result in account action.',
    ],
  },
  {
    heading: '8. Cancellations and Rescheduling',
    paragraphs: [
      'Cancellations and rescheduling should be coordinated directly between the Customer and Worker, through in-app chat where possible.',
      'IslaJobs may update guidance around cancellations to address fraud, safety, or marketplace integrity. Material changes may be communicated through the app.',
    ],
  },
  {
    heading: '9. Payments',
    paragraphs: [
      'IslaJobs does not process payments inside the app. Customers and Workers agree on the payment method — cash, GCash, or another method — directly with each other.',
      'A Worker may optionally save a payout method (GCash or Maya) on their profile for their own reference, in preparation for in-app payments in a future update.',
    ],
  },
  {
    heading: '10. Prohibited Activities',
    paragraphs: [
      'You must not use IslaJobs to:',
      '• Request, offer, or perform illegal services or activities.',
      '• Engage in fraud, impersonation, or misrepresentation — including fake profile photos, false credentials, or misleading job posts.',
      '• Harass, threaten, or discriminate against other users.',
      '• Upload content that violates laws or third-party rights, including intellectual property and privacy rights.',
    ],
  },
  {
    heading: '11. Content',
    paragraphs: [
      'Users may submit content such as profile details, bio, job posts, photos, and messages.',
      'You are responsible for content you submit and warrant that you have the right to submit it.',
      'IslaJobs may remove content that violates these Terms, platform rules, or applicable law.',
    ],
  },
  {
    heading: '12. Verification',
    paragraphs: [
      'Workers may voluntarily submit a government ID and a Police Clearance to be reviewed for a Verified Worker badge.',
      'IslaJobs reviews verification submissions in good faith but does not guarantee the accuracy of information provided by any user, verified or not.',
    ],
  },
  {
    heading: '13. Limitation of Liability',
    paragraphs: [
      'To the fullest extent permitted by law, IslaJobs is not liable for personal injury, property damage, loss, or disagreements arising from interactions or services between Customers and Workers.',
      'IslaJobs facilitates connections between Customers and Workers but does not perform, supervise, or guarantee the outcome of any job.',
    ],
  },
  {
    heading: '14. Account Suspension and Termination',
    paragraphs: [
      'IslaJobs may suspend or terminate accounts for fraud, abuse, safety concerns, or violation of these Terms or platform rules.',
      'You may stop using IslaJobs at any time. You may request account deletion subject to applicable retention requirements — see our Privacy Policy.',
    ],
  },
  {
    heading: '15. Governing Law',
    paragraphs: [
      'These Terms are governed by the laws of the Republic of the Philippines, without regard to conflict-of-law principles.',
    ],
  },
  {
    heading: '16. Changes to These Terms',
    paragraphs: [
      'IslaJobs may update these Terms from time to time.',
      'If changes are material, notice may be provided through the app. Continued use after updates take effect means you accept the updated Terms.',
    ],
  },
  {
    heading: '17. Contact',
    paragraphs: [
      'For questions about these Terms, contact support:',
      `Email: ${SUPPORT_EMAIL}`,
      'You can also reach support via the Help & Support section in the app.',
    ],
  },
]

export default function TermsPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <TopBar title="Terms of Service" />

      <div className="flex-1 pt-14 px-4 pb-6 space-y-4">
        <div className="card !rounded-[20px] flex items-center gap-3.5 mt-4">
          <div
            className="w-12 h-12 rounded-[14px] flex items-center justify-center shrink-0"
            style={{ background: 'var(--color-primary-xlight)' }}
          >
            <FileText size={22} color="var(--color-primary)" strokeWidth={1.8} />
          </div>
          <div>
            <p className="text-[16px] font-bold text-text-primary">Terms of Service</p>
            <p className="text-[13px] text-text-secondary">Last updated: {LAST_UPDATED}</p>
          </div>
        </div>

        {SECTIONS.map((section) => (
          <div key={section.heading} className="card !rounded-[20px]">
            <h2 className="text-[15px] font-bold text-text-primary mb-2.5">{section.heading}</h2>
            <div className="flex flex-col gap-2.5">
              {section.paragraphs.map((p, i) => (
                <p key={i} className="text-[14px] text-text-secondary leading-relaxed">
                  {p}
                </p>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
