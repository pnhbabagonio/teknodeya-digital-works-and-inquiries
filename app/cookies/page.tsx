import { Metadata } from 'next'
import { LegalPage } from '@/components/sections/legal-page'

export const metadata: Metadata = {
  title: 'Cookie Policy',
  description:
    'Learn how Teknodeya uses cookies and similar technologies on our website.',
  openGraph: {
    title: 'Cookie Policy | Teknodeya',
    description:
      'Learn how Teknodeya uses cookies and similar technologies on our website.',
  },
}

export default function CookiesPage() {
  return (
    <LegalPage
      title="Cookie"
      highlight="Policy"
      description="A clear breakdown of the cookies we use, why we use them, and how you can manage your preferences."
      lastUpdated="April 25, 2026"
      intro="This Cookie Policy explains how Teknodeya uses cookies and similar technologies when you visit our website. It should be read together with our Privacy Policy, which describes how we handle your personal information more broadly."
      sections={[
        {
          heading: 'What Are Cookies?',
          paragraphs: [
            'Cookies are small text files placed on your device when you visit a website. They are widely used to make websites work efficiently, to improve the user experience, and to provide information to site owners about how their site is used.',
          ],
        },
        {
          heading: 'Types of Cookies We Use',
          bullets: [
            'Strictly necessary cookies — required for core functionality such as page navigation and access to secure areas. The site cannot function properly without these.',
            'Performance and analytics cookies — help us understand how visitors interact with our website by collecting anonymous information.',
            'Functional cookies — remember choices you make (such as language or region) to provide a more personalized experience.',
            'Marketing cookies — used, with your consent, to deliver relevant content and measure the effectiveness of campaigns.',
          ],
        },
        {
          heading: 'Third‑Party Cookies',
          paragraphs: [
            'Some cookies are set by third‑party services that appear on our pages — for example, analytics providers and embedded media. These third parties may use cookies to collect information about your activity across multiple websites.',
          ],
        },
        {
          heading: 'Managing Your Preferences',
          paragraphs: [
            'You can control and manage cookies in several ways. Most browsers allow you to view, delete, or block cookies through their settings. Please note that blocking certain cookies may affect the functionality of our website.',
          ],
          bullets: [
            'Adjust cookie settings directly in your browser preferences.',
            'Use private browsing or incognito mode to limit cookies during a session.',
            'Opt out of analytics tracking using tools provided by analytics vendors.',
          ],
        },
        {
          heading: 'Other Tracking Technologies',
          paragraphs: [
            'In addition to cookies, we may use related technologies such as web beacons or pixels to understand how visitors engage with our content. These technologies are governed by this Cookie Policy.',
          ],
        },
        {
          heading: 'Changes to This Policy',
          paragraphs: [
            'We may update this Cookie Policy from time to time to reflect changes in technology, regulation, or our business practices. The "Last updated" date above indicates when the most recent changes were made.',
          ],
        },
        {
          heading: 'Contact Us',
          paragraphs: [
            'If you have questions about our use of cookies, please contact us at pnhbabagonio@gmail.com or through the inquiry form on our website.',
          ],
        },
      ]}
    />
  )
}
