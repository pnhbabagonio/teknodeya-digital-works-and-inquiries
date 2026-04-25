// app/api/inquiries/confirmation/route.ts
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { NextResponse } from 'next/server'
import { Resend } from 'resend'
import {
  SIGNATURE_IMAGE_CONTENT_ID,
  buildInquiryConfirmationEmail,
} from '@/lib/emails/inquiry-confirmation'

export const runtime = 'nodejs'

const FROM_ADDRESS =
  process.env.INQUIRY_FROM_EMAIL || 'Teknodeya <onboarding@resend.dev>'
const REPLY_TO_ADDRESS =
  process.env.INQUIRY_REPLY_TO_EMAIL || 'pnhbabagonio@gmail.com'
const SIGNATURE_IMAGE_PATH = join(
  process.cwd(),
  'public',
  'assets',
  'emailsignature.png'
)
const SIGNATURE_IMAGE_PUBLIC_PATH = '/assets/emailsignature.png'

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

    const signatureImage = await getSignatureImage()

    const { subject, html, text } = buildInquiryConfirmationEmail({
      fullName: fullName ?? '',
      referenceNumber,
      signatureImageSrc: signatureImage.src,
    })

    const { data, error } = await resend.emails.send({
      from: FROM_ADDRESS,
      to: email,
      subject,
      html,
      text,
      replyTo: REPLY_TO_ADDRESS,
      attachments: signatureImage.attachments,
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

async function getSignatureImage(): Promise<{
  src: string
  attachments?: Array<{
    filename: string
    content: string
    contentId: string
  }>
}> {
  try {
    const image = await readFile(SIGNATURE_IMAGE_PATH)

    return {
      src: `cid:${SIGNATURE_IMAGE_CONTENT_ID}`,
      attachments: [
        {
          filename: 'emailsignature.png',
          content: image.toString('base64'),
          contentId: SIGNATURE_IMAGE_CONTENT_ID,
        },
      ],
    }
  } catch (error) {
    console.error('[v0] Could not read local email signature:', error)

    return {
      src: getPublicSignatureImageUrl(),
    }
  }
}

function getPublicSignatureImageUrl(): string {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL

  if (!siteUrl) {
    return SIGNATURE_IMAGE_PUBLIC_PATH
  }

  try {
    const baseUrl = /^https?:\/\//i.test(siteUrl)
      ? siteUrl
      : `https://${siteUrl}`

    return new URL(SIGNATURE_IMAGE_PUBLIC_PATH, baseUrl).toString()
  } catch (error) {
    console.error('[v0] Invalid NEXT_PUBLIC_SITE_URL:', error)
    return SIGNATURE_IMAGE_PUBLIC_PATH
  }
}
