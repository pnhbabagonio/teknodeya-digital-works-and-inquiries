// app/api/inquiries/confirmation/route.ts
import { NextResponse } from 'next/server'
import { Resend } from 'resend'
import { buildInquiryConfirmationEmail } from '@/lib/emails/inquiry-confirmation'

export const runtime = 'nodejs'

const FROM_ADDRESS =
  process.env.INQUIRY_FROM_EMAIL || 'Teknodeya <onboarding@resend.dev>'

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      email?: string
      fullName?: string
      referenceNumber?: string
    }

    const { email, fullName, referenceNumber } = body

    if (!email || !referenceNumber) {
      return NextResponse.json(
        { error: 'email and referenceNumber are required' },
        { status: 400 }
      )
    }

    if (!process.env.RESEND_API_KEY) {
      console.error('[v0] Missing RESEND_API_KEY env var')
      return NextResponse.json(
        { error: 'Email service is not configured' },
        { status: 500 }
      )
    }

    const resend = new Resend(process.env.RESEND_API_KEY)

    const { subject, html, text } = buildInquiryConfirmationEmail({
      fullName: fullName ?? '',
      referenceNumber,
    })

    const { data, error } = await resend.emails.send({
      from: FROM_ADDRESS,
      to: email,
      subject,
      html,
      text,
    })

    if (error) {
      console.error('[v0] Resend error:', error)
      return NextResponse.json(
        { error: error.message ?? 'Failed to send email' },
        { status: 502 }
      )
    }

    return NextResponse.json({ ok: true, id: data?.id })
  } catch (error) {
    console.error('[v0] Confirmation route error:', error)
    const message =
      error instanceof Error ? error.message : 'Unexpected server error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
