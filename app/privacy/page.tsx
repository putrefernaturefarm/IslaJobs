import { TopBar } from '@/components/layout/TopBar'
import { Shield } from 'lucide-react'

const LAST_UPDATED = '2026-10-24'
const PRIVACY_EMAIL = 'privacy@islajobs.ph'

const SECTIONS: { heading: string; paragraphs: string[] }[] = [
  {
    heading: '1. Introduction',
    paragraphs: [
      'This Privacy Policy explains how IslaJobs ("IslaJobs", "we", "us") collects, uses, stores, shares, and protects information when you use the IslaJobs mobile application and related services (the "Service").',
      'By creating an account or using IslaJobs, you acknowledge that you have read and understood this Privacy Policy.',
    ],
  },
  {
    heading: '2. Scope and Applicability',
    paragraphs: [
      'This policy applies to customers and workers using the Service, including browsing, messaging, bookings, and job posts.',
      'This policy is intended to align with applicable privacy and data protection requirements, including the Philippine Data Privacy Act of 2012 (RA 10173) and related regulations, where applicable.',
    ],
  },
  {
    heading: '3. Information We Collect',
    paragraphs: [
      'We collect information to operate the Service. Depending on how you use IslaJobs, this may include:',
      '• Personal Identification: name and phone number (required for all accounts), and a profile photo if you choose to add one.',
      '• Account & Profile Data: your role (customer or worker), bio, location, availability, and licenses/credentials you choose to add.',
      '• Booking & Job Post Data: job descriptions, schedules, addresses/locations provided for a booking, and booking status updates.',
      '• Communication Data: messages exchanged through in-app chat.',
      '• Verification Data (workers): identity verification submissions such as government ID images and Police Clearance documents, when you choose to submit them for a Verified Worker badge.',
      '• Payout Preference (workers): your chosen payout method (GCash or Maya) and account details, saved for your own reference and for future use — see Section 6.',
      '• Device & Usage Data: basic technical information (such as device and browser type) that is collected automatically to keep the Service running reliably and securely.',
      '• Location Data (optional): if you enable location features, IslaJobs may use your approximate location to help discover nearby workers/jobs and improve matching. You can disable location access in your device settings.',
    ],
  },
  {
    heading: '4. How We Use Your Information',
    paragraphs: [
      'We use information for the following purposes:',
      '• Account Management: create, verify, and manage accounts and authentication sessions.',
      '• Marketplace Operations: show relevant workers/jobs, enable bookings and job post applications, and coordinate schedules.',
      '• Communication: enable chat and send notifications (booking updates, verification status, support updates).',
      '• Safety & Security: review verification submissions, detect and prevent abuse, and protect users and the Service.',
      '• Analytics & Improvement: troubleshoot errors and improve features and user experience.',
      '• Legal & Compliance: comply with legal obligations and respond to valid legal requests.',
    ],
  },
  {
    heading: '5. Location Data and Controls',
    paragraphs: [
      'Location features are optional. If enabled, IslaJobs may use location information to improve discovery and matching (e.g., finding nearby workers or jobs, and calculating distance shown on a profile).',
      'IslaJobs is designed to use location only when needed for product functionality. You can control location access through your device permissions, and some features may show reduced functionality if location is disabled.',
    ],
  },
  {
    heading: '6. Payments',
    paragraphs: [
      'IslaJobs does not process payments inside the app. Customers and workers agree on the payment method — cash, GCash, or another method — directly with each other when booking.',
      'Workers can optionally save a payout method (GCash or Maya) on their profile for their own reference, in preparation for in-app payments in a future update. IslaJobs does not collect card numbers or process transactions through this feature.',
    ],
  },
  {
    heading: '7. Data Sharing',
    paragraphs: [
      'We share information only as needed to operate the Service:',
      '• With Other Users: limited profile and booking information is shared between customers and workers to coordinate services (e.g., name, profile photo, booking details, chat messages).',
      '• With Service Providers: infrastructure and operational providers (e.g., hosting, storage) that support the Service under contractual safeguards.',
      '• With Authorities: when required by law, regulation, or a valid legal request.',
      'We do not sell personal information to third parties.',
    ],
  },
  {
    heading: '8. International Processing',
    paragraphs: [
      'IslaJobs may use cloud infrastructure or service providers that process or store information on servers located outside the Philippines. Where applicable, we take steps intended to ensure appropriate safeguards for cross-border data transfers.',
    ],
  },
  {
    heading: '9. Data Retention',
    paragraphs: [
      'We retain information for as long as needed to provide the Service and for legitimate business purposes, including maintaining accurate booking records, complying with legal obligations, and resolving account issues.',
      'When you request account deletion, we will delete or anonymize personal information that is no longer required for legal, security, or operational reasons.',
    ],
  },
  {
    heading: '10. Account Deletion',
    paragraphs: [
      'You may request deletion of your IslaJobs account and associated personal information, subject to the retention requirements described above.',
      'To request deletion: use Delete Account in More → Danger Zone, or contact support.',
      `Support email: ${PRIVACY_EMAIL}`,
      'You can also contact us through the Help & Support section in the app.',
    ],
  },
  {
    heading: '11. Data Security',
    paragraphs: [
      'IslaJobs uses reasonable technical and organizational measures to protect information, including access controls and monitoring for suspicious activity.',
      'No method of transmission or storage is completely secure. Use a strong password, keep your device secure, and report suspicious activity to support.',
    ],
  },
  {
    heading: '12. Your Rights',
    paragraphs: [
      'Depending on applicable law, you may have rights relating to your personal information, such as:',
      '• Access: request a copy of information we hold about you.',
      '• Correction: request correction of inaccurate or incomplete information.',
      '• Deletion: request deletion of your account and certain personal information, subject to legal obligations and legitimate retention needs.',
      '• Objection / Restriction: object to or request restriction of certain processing where applicable.',
      'To exercise these rights, contact support through the app or via the email above.',
    ],
  },
  {
    heading: "13. Children's Privacy",
    paragraphs: [
      'IslaJobs is not intended for individuals under 18 years of age.',
      'We do not knowingly collect personal information from children under 18. If we become aware of such collection, we will take steps to delete the information.',
    ],
  },
  {
    heading: '14. Changes to This Privacy Policy',
    paragraphs: [
      'We may update this Privacy Policy to reflect changes in practices, features, or legal requirements.',
      'When changes are material, we may notify you in the app or through other reasonable channels. Continued use after changes take effect means you accept the updated policy.',
    ],
  },
  {
    heading: '15. Contact',
    paragraphs: [
      'For questions about this Privacy Policy or privacy requests:',
      `Email: ${PRIVACY_EMAIL}`,
      'You can also contact us through the Help & Support section in the app.',
    ],
  },
]

export default function PrivacyPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <TopBar title="Privacy Policy" />

      <div className="flex-1 pt-14 px-4 pb-6 space-y-4">
        <div className="card !rounded-[20px] flex items-center gap-3.5 mt-4">
          <div
            className="w-12 h-12 rounded-[14px] flex items-center justify-center shrink-0"
            style={{ background: 'var(--color-success-light)' }}
          >
            <Shield size={22} color="#16A34A" strokeWidth={1.8} />
          </div>
          <div>
            <p className="text-[16px] font-bold text-text-primary">Privacy Policy</p>
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
