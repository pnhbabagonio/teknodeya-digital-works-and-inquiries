export const inquiryStatusOptions = [
  {
    value: 'new-inquiry',
    label: 'New Inquiry',
    badgeClassName: 'border-primary/20 bg-primary/10 text-primary',
    iconClassName: 'text-primary',
    statBgClassName: 'bg-primary/10',
  },
  {
    value: 'contacted',
    label: 'Contacted',
    badgeClassName: 'border-secondary/20 bg-secondary/10 text-secondary',
    iconClassName: 'text-secondary',
    statBgClassName: 'bg-secondary/10',
  },
  {
    value: 'ongoing-discussion',
    label: 'Ongoing Discussion',
    badgeClassName: 'border-blue-500/20 bg-blue-500/10 text-blue-500',
    iconClassName: 'text-blue-500',
    statBgClassName: 'bg-blue-500/10',
  },
  {
    value: 'closed',
    label: 'Closed',
    badgeClassName: 'border-green-500/20 bg-green-500/10 text-green-500',
    iconClassName: 'text-green-500',
    statBgClassName: 'bg-green-500/10',
  },
] as const

export type InquiryStatus = (typeof inquiryStatusOptions)[number]['value']

export const DEFAULT_INQUIRY_STATUS: InquiryStatus = 'new-inquiry'

const legacyStatusMap: Record<string, InquiryStatus> = {
  pending: 'new-inquiry',
  new: 'new-inquiry',
  'new inquiry': 'new-inquiry',
  new_inquiry: 'new-inquiry',
  'in-progress': 'ongoing-discussion',
  in_progress: 'ongoing-discussion',
  ongoing: 'ongoing-discussion',
  'ongoing discussion': 'ongoing-discussion',
  completed: 'closed',
  complete: 'closed',
  cancelled: 'closed',
  canceled: 'closed',
}

export function isInquiryStatus(value: string): value is InquiryStatus {
  return inquiryStatusOptions.some((option) => option.value === value)
}

export function normalizeInquiryStatus(status?: string | null): InquiryStatus {
  const normalized = status?.trim().toLowerCase()

  if (!normalized) {
    return DEFAULT_INQUIRY_STATUS
  }

  if (isInquiryStatus(normalized)) {
    return normalized
  }

  return legacyStatusMap[normalized] ?? DEFAULT_INQUIRY_STATUS
}

export function getInquiryStatusMeta(status?: string | null) {
  const normalizedStatus = normalizeInquiryStatus(status)

  return (
    inquiryStatusOptions.find((option) => option.value === normalizedStatus) ??
    inquiryStatusOptions[0]
  )
}
