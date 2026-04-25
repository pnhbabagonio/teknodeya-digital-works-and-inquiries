import { Metadata } from 'next'
import { LegalPage } from '@/components/sections/legal-page'

export const metadata: Metadata = {
  title: 'Terms of Service',
  description:
    'The terms and conditions that govern your use of the Teknodeya website and services.',
  openGraph: {
    title: 'Terms of Service | Teknodeya',
    description:
      'The terms and conditions that govern your use of the Teknodeya website and services.',
  },
}

export default function TermsPage() {
  return (
    <LegalPage
      title="Terms of"
      highlight="Service"
      description="The ground rules for using our website and engaging with our team. By using our services, you agree to these terms."
      lastUpdated="April 25, 2026"
      intro={`These Terms of Service ("Terms") govern your access to and use of the Teknodeya website and any services we provide. By accessing our website or engaging Teknodeya for services, you agree to be bound by these Terms.`}
      sections={[
        {
          heading: 'Use of the Website',
          paragraphs: [
            'You may use our website for lawful purposes only. You agree not to use the site in any way that violates applicable laws or regulations, infringes on the rights of others, or interferes with the operation of the site.',
          ],
        },
        {
          heading: 'Intellectual Property',
          paragraphs: [
            'All content on this website — including text, graphics, logos, and software — is owned by Teknodeya or its licensors and is protected by intellectual property laws. You may not copy, modify, distribute, or create derivative works from our content without our prior written consent.',
            'Work product delivered as part of a paid engagement transfers to the client according to the terms of the applicable Statement of Work or written agreement.',
          ],
        },
        {
          heading: 'Project Engagements',
          paragraphs: [
            'Any project we deliver for you is governed by a separate Statement of Work or service agreement, which controls scope, deliverables, fees, timelines, and intellectual property rights.',
          ],
          bullets: [
            'Scope changes may affect timelines and pricing and will be agreed upon in writing.',
            'Invoices are payable according to the schedule in the applicable agreement.',
            'Either party may terminate an engagement under the conditions described in that agreement.',
          ],
        },
        {
          heading: 'Disclaimers',
          paragraphs: [
            'Our website is provided on an "as is" and "as available" basis. We make no warranties, express or implied, regarding the operation, accuracy, or availability of the site, including any content or materials provided through it.',
          ],
        },
        {
          heading: 'Limitation of Liability',
          paragraphs: [
            'To the maximum extent permitted by law, Teknodeya will not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of our website or services. Our total liability for any claim relating to a paid engagement is limited to the fees paid by you for the services giving rise to the claim.',
          ],
        },
        {
          heading: 'Third‑Party Links',
          paragraphs: [
            'Our website may contain links to third‑party sites. We are not responsible for the content or practices of those sites and do not endorse them. Visiting third‑party sites is at your own risk.',
          ],
        },
        {
          heading: 'Changes to These Terms',
          paragraphs: [
            'We may update these Terms from time to time. Updates take effect when posted to this page. Continued use of our website or services after changes are posted constitutes your acceptance of the revised Terms.',
          ],
        },
        {
          heading: 'Governing Law',
          paragraphs: [
            'These Terms are governed by and construed in accordance with the laws of the jurisdiction in which Teknodeya is established, without regard to its conflict of laws principles.',
          ],
        },
        {
          heading: 'Contact Us',
          paragraphs: [
            'Questions about these Terms? Reach us at hello@teknodeya.ph or through the inquiry form on our website.',
          ],
        },
      ]}
    />
  )
}
