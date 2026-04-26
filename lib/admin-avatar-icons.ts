import {
  Briefcase,
  CircleUser,
  Code2,
  Crown,
  Palette,
  Rocket,
  Shield,
  Smile,
  Sparkles,
  User,
  type LucideIcon,
} from 'lucide-react'

export const DEFAULT_ADMIN_AVATAR_ICON = 'user'

export const adminAvatarIcons = [
  { value: 'user', label: 'User', icon: User },
  { value: 'circle-user', label: 'Profile', icon: CircleUser },
  { value: 'smile', label: 'Smile', icon: Smile },
  { value: 'sparkles', label: 'Sparkles', icon: Sparkles },
  { value: 'rocket', label: 'Rocket', icon: Rocket },
  { value: 'code', label: 'Code', icon: Code2 },
  { value: 'palette', label: 'Palette', icon: Palette },
  { value: 'briefcase', label: 'Briefcase', icon: Briefcase },
  { value: 'shield', label: 'Shield', icon: Shield },
  { value: 'crown', label: 'Crown', icon: Crown },
] as const satisfies ReadonlyArray<{
  value: string
  label: string
  icon: LucideIcon
}>

export type AdminAvatarIconName = (typeof adminAvatarIcons)[number]['value']

export function isAdminAvatarIconName(value: string): value is AdminAvatarIconName {
  return adminAvatarIcons.some((option) => option.value === value)
}

export function normalizeAdminAvatarIcon(value?: string | null): AdminAvatarIconName {
  return value && isAdminAvatarIconName(value)
    ? value
    : DEFAULT_ADMIN_AVATAR_ICON
}

export function getAdminAvatarIcon(value?: string | null): LucideIcon {
  return adminAvatarIcons.find((option) => option.value === value)?.icon ?? User
}
