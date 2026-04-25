// app/inquiry/page.tsx
import { Metadata } from 'next'
import { InquiryForm } from '@/components/forms/inquiry-form'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export const metadata: Metadata = {
  title: 'Project Inquiry',
  description: 'Start your project with Teknodeya. Fill out our inquiry form and we\'ll get back to you within 24-48 hours.',
}

const validServices = new Set([
  'web-development',
  'mobile-app',
  'ui-ux-design',
  'creative-design',
])

export default async function InquiryPage({
  searchParams,
}: {
  searchParams: Promise<{ service?: string }>
}) {
  const { service } = await searchParams
  const initialService =
    service && validServices.has(service) ? service : undefined

  return (
    <main className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4">
              Start Your <span className="gradient-text">Project</span>
            </h1>
            <p className="text-text-muted text-lg">
              Tell us about your idea and we'll help bring it to life
            </p>
          </div>

          {/* Form Card */}
          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle>Project Inquiry Form</CardTitle>
              <CardDescription>
                Please fill out the form below with as much detail as possible. 
                We'll review your project and get back to you within 24-48 hours.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <InquiryForm initialService={initialService} />
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  )
}
