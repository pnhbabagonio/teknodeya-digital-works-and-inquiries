// lib/emails/inquiry-confirmation.ts
// HTML email template sent to clients after they submit an inquiry.

const SIGNATURE_IMAGE_URL =
  'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/emailsignature-p7ZGfqQJdKb9B1XgcFMW5vc7of3whR.png'

interface InquiryConfirmationParams {
  fullName: string
  referenceNumber: string
}

export function buildInquiryConfirmationEmail({
  fullName,
  referenceNumber,
}: InquiryConfirmationParams): { subject: string; html: string; text: string } {
  const safeName = fullName?.trim() || 'there'

  const subject = `We received your inquiry — ${referenceNumber}`

  const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <title>${subject}</title>
  </head>
  <body style="margin:0;padding:0;background-color:#f5f5f4;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#0f1419;">
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color:#f5f5f4;padding:32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="600" style="max-width:600px;background-color:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.06);">
            <tr>
              <td style="padding:32px 32px 8px 32px;">
                <h1 style="margin:0 0 16px 0;font-size:22px;line-height:1.3;font-weight:700;color:#0f1419;">
                  Thank you for reaching out, ${escapeHtml(safeName)}!
                </h1>
                <p style="margin:0 0 16px 0;font-size:15px;line-height:1.6;color:#374151;">
                  We&rsquo;ve received your project inquiry at <strong>Teknodeya</strong> and our team is already reviewing the details.
                  Someone from Teknodeya will personally message you shortly to discuss your project further, walk through the next steps, and answer any questions you may have.
                </p>
                <div style="margin:24px 0;padding:16px 20px;background-color:#f8fafc;border:1px solid #e5e7eb;border-radius:8px;">
                  <p style="margin:0 0 4px 0;font-size:12px;text-transform:uppercase;letter-spacing:0.06em;color:#6b7280;">
                    Reference Number
                  </p>
                  <p style="margin:0;font-size:18px;font-family:'SFMono-Regular',Menlo,Consolas,monospace;font-weight:700;color:#0891b2;letter-spacing:0.04em;">
                    ${escapeHtml(referenceNumber)}
                  </p>
                </div>
                <p style="margin:0 0 16px 0;font-size:15px;line-height:1.6;color:#374151;">
                  Please keep this reference number for your records — you can mention it in any follow-up message so we can pull up your inquiry instantly.
                </p>
                <p style="margin:0 0 32px 0;font-size:15px;line-height:1.6;color:#374151;">
                  In the meantime, feel free to reply to this email if you have anything else you&rsquo;d like to share about your project.
                </p>
              </td>
            </tr>
            <tr>
              <td style="padding:0 32px 32px 32px;">
                <p style="margin:0 0 16px 0;font-size:15px;line-height:1.6;color:#374151;">
                  Talk soon,<br />
                  The Teknodeya Team
                </p>
                <img
                  src="${SIGNATURE_IMAGE_URL}"
                  alt="Philip Neel Babagonio — Chief Executive Officer, Teknodeya"
                  width="520"
                  style="display:block;max-width:100%;height:auto;border:0;outline:none;text-decoration:none;"
                />
              </td>
            </tr>
          </table>
          <p style="margin:16px 0 0 0;font-size:12px;color:#9ca3af;">
            This is an automated confirmation from Teknodeya.
          </p>
        </td>
      </tr>
    </table>
  </body>
</html>`

  const text = [
    `Thank you for reaching out, ${safeName}!`,
    '',
    "We've received your project inquiry at Teknodeya and our team is already reviewing the details. Someone from Teknodeya will personally message you shortly to discuss your project further, walk through the next steps, and answer any questions you may have.",
    '',
    `Reference Number: ${referenceNumber}`,
    '',
    "Please keep this reference number for your records — you can mention it in any follow-up message so we can pull up your inquiry instantly.",
    '',
    "In the meantime, feel free to reply to this email if you have anything else you'd like to share about your project.",
    '',
    'Talk soon,',
    'The Teknodeya Team',
    '',
    'Philip Neel Babagonio',
    'Chief Executive Officer',
    'Teknodeya',
    '09978142880',
    'pnhbabagonio@gmail.com',
    'teknodeya.vercel.app',
  ].join('\n')

  return { subject, html, text }
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}
