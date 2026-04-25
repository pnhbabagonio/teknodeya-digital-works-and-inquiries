import { Card, CardContent } from '@/components/ui/card'

interface LegalSection {
  heading: string
  paragraphs?: string[]
  bullets?: string[]
}

interface LegalPageProps {
  title: string
  highlight: string
  description: string
  lastUpdated: string
  intro?: string
  sections: LegalSection[]
}

export function LegalPage({
  title,
  highlight,
  description,
  lastUpdated,
  intro,
  sections,
}: LegalPageProps) {
  return (
    <main className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4 text-balance">
            {title} <span className="gradient-text">{highlight}</span>
          </h1>
          <p className="text-text-muted text-lg max-w-2xl mx-auto text-pretty">
            {description}
          </p>
          <p className="text-text-muted/70 text-sm mt-4">
            Last updated: {lastUpdated}
          </p>
        </div>

        <Card className="max-w-3xl mx-auto border-primary/10">
          <CardContent className="p-6 md:p-10">
            {intro && (
              <p className="text-text-muted leading-relaxed mb-8">{intro}</p>
            )}

            <div className="space-y-8">
              {sections.map((section, index) => (
                <section key={section.heading}>
                  <h2 className="text-xl md:text-2xl font-heading font-semibold mb-3">
                    <span className="text-primary mr-2 font-mono text-base">
                      {String(index + 1).padStart(2, '0')}.
                    </span>
                    {section.heading}
                  </h2>
                  {section.paragraphs?.map((paragraph, pIndex) => (
                    <p
                      key={pIndex}
                      className="text-text-muted leading-relaxed mb-3 last:mb-0"
                    >
                      {paragraph}
                    </p>
                  ))}
                  {section.bullets && (
                    <ul className="list-disc pl-6 space-y-2 text-text-muted leading-relaxed mt-3">
                      {section.bullets.map((bullet) => (
                        <li key={bullet}>{bullet}</li>
                      ))}
                    </ul>
                  )}
                </section>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
