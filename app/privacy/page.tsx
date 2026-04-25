import { Metadata } from 'next'
import { LegalPage } from '@/components/sections/legal-page'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description:
    'Learn how Teknodeya collects, uses, and protects your personal information.',
  openGraph: {
    title: 'Privacy Policy | Teknodeya',
    description:
      'Learn how Teknodeya collects, uses, and protects your personal information.',
  },
}

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy"
      highlight="Policy"
      description="Your privacy matters. This policy explains what we collect, how we use it, and the choices you have."
      lastUpdated="April 25, 2026"
      intro={`This Privacy Policy describes how Teknodeya ("we", "us", or "our") collects, uses, and shares information about you when you visit our website, contact us through our inquiry form, or otherwise interact with our services.`}
      sections={[
        {
          heading: 'Information We Collect',
          paragraphs: [
            'We collect information that you voluntarily provide to us when you submit an inquiry, request a proposal, or otherwise communicate with us. We also collect a limited amount of technical information automatically when you visit our website.',
          ],
          bullets: [
            'Contact details such as your name, email address, company, and phone number.',
            'Project information you choose to share, including budget ranges, timelines, and project descriptions.',
            'Technical data such as IP address, browser type, device information, and pages viewed.',
            'Cookie and analytics data as described in our Cookie Policy.',
          ],
        },
        {
          heading: 'How We Use Your Information',
          paragraphs: [
            'We use the information we collect to deliver, maintain, and improve our services, communicate with you, and comply with our legal obligations.',
          ],
          bullets: [
            'Responding to inquiries and providing requested information or proposals.',
            'Delivering services to you under an agreement and providing ongoing support.',
            'Improving the performance, security, and content of our website.',
            'Sending project updates and, with your consent, occasional marketing communications.',
          ],
        },
        {
          heading: 'How We Share Your Information',
          paragraphs: [
            'We do not sell your personal information. We share information only with trusted service providers who help us operate our business, or when required to do so by law.',
          ],
          bullets: [
            'Service providers that host our website, send email, or provide analytics.',
            'Professional advisors such as accountants, auditors, and lawyers.',
            'Authorities when required by law, court order, or to protect our legal rights.',
          ],
        },
        {
          heading: 'Data Retention',
          paragraphs: [
            'We retain your information for as long as is necessary to fulfill the purposes for which it was collected, including any legal, accounting, or reporting requirements. When information is no longer needed, we securely delete or anonymize it.',
          ],
        },
        {
          heading: 'Your Rights',
          paragraphs: [
            'Depending on where you live, you may have rights regarding your personal information.',
          ],
          bullets: [
            'Access — request a copy of the personal information we hold about you.',
            'Correction — request that we correct inaccurate or incomplete information.',
            'Deletion — request that we delete your personal information, subject to certain exceptions.',
            'Objection — object to or restrict our processing of your information in certain cases.',
          ],
        },
        {
          heading: 'Security',
          paragraphs: [
            'We use reasonable administrative, technical, and physical safeguards designed to protect your information. However, no method of transmission over the internet is completely secure, and we cannot guarantee absolute security.',
          ],
        },
        {
          heading: 'Changes to This Policy',
          paragraphs: [
            'We may update this Privacy Policy from time to time. When we do, we will revise the "Last updated" date above. Material changes will be communicated through our website or by email when appropriate.',
          ],
        },
        {
          heading: 'Contact Us',
          paragraphs: [
            'If you have questions about this Privacy Policy or our practices, please contact us at pnhbabagonio@gmail.com or through the inquiry form on our website.',
          ],
        },
      ]}
    />
  )
}
