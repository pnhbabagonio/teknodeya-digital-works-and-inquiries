// components/admin/settings-form.tsx
'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'
import { createClient } from '@/lib/supabase/client'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import {
  User,
  Lock,
  Bell,
  Shield,
  Save,
} from 'lucide-react'

const profileSchema = z.object({
  full_name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
})

const passwordSchema = z.object({
  current_password: z.string().min(6, 'Password must be at least 6 characters'),
  new_password: z.string().min(6, 'Password must be at least 6 characters'),
  confirm_password: z.string(),
}).refine((data) => data.new_password === data.confirm_password, {
  message: "Passwords don't match",
  path: ["confirm_password"],
})

type ProfileFormData = z.infer<typeof profileSchema>
type PasswordFormData = z.infer<typeof passwordSchema>
type SettingsTab = 'profile' | 'notifications' | 'security'

const settingsTabs: Array<{
  value: SettingsTab
  label: string
  icon: typeof User
}> = [
  { value: 'profile', label: 'Profile', icon: User },
  { value: 'notifications', label: 'Notifications', icon: Bell },
  { value: 'security', label: 'Security', icon: Shield },
]

interface SettingsFormProps {
  profile: any
}

export function SettingsForm({ profile }: SettingsFormProps) {
  const [activeTab, setActiveTab] = useState<SettingsTab>('profile')
  const [isLoading, setIsLoading] = useState(false)
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [pushNotifications, setPushNotifications] = useState(true)
  const supabase = createClient()

  const {
    register: registerProfile,
    handleSubmit: handleProfileSubmit,
    formState: { errors: profileErrors },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      full_name: profile?.full_name || '',
      email: profile?.email || '',
    },
  })

  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    reset: resetPassword,
    formState: { errors: passwordErrors },
  } = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
  })

  const onProfileSubmit = async (data: ProfileFormData) => {
    setIsLoading(true)
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: data.full_name,
        })
        .eq('id', profile.id)

      if (error) throw error

      toast.success('Profile updated successfully')
    } catch (error) {
      toast.error('Failed to update profile')
    } finally {
      setIsLoading(false)
    }
  }

  const onPasswordSubmit = async (data: PasswordFormData) => {
    setIsLoading(true)
    try {
      const { error } = await supabase.auth.updateUser({
        password: data.new_password
      })

      if (error) throw error

      toast.success('Password updated successfully')
      resetPassword()
    } catch (error) {
      toast.error('Failed to update password')
    } finally {
      setIsLoading(false)
    }
  }

  const handleTabKeyDown = (
    event: React.KeyboardEvent<HTMLButtonElement>,
    currentTab: SettingsTab
  ) => {
    const currentIndex = settingsTabs.findIndex((tab) => tab.value === currentTab)
    const lastIndex = settingsTabs.length - 1

    if (event.key === 'ArrowRight') {
      event.preventDefault()
      setActiveTab(settingsTabs[currentIndex === lastIndex ? 0 : currentIndex + 1].value)
    }

    if (event.key === 'ArrowLeft') {
      event.preventDefault()
      setActiveTab(settingsTabs[currentIndex === 0 ? lastIndex : currentIndex - 1].value)
    }

    if (event.key === 'Home') {
      event.preventDefault()
      setActiveTab(settingsTabs[0].value)
    }

    if (event.key === 'End') {
      event.preventDefault()
      setActiveTab(settingsTabs[lastIndex].value)
    }
  }

  return (
    <div className="space-y-6">
      <div
        role="tablist"
        aria-label="Settings sections"
        className="inline-flex h-10 items-center justify-center rounded-md bg-surface p-1 text-text-muted"
      >
        {settingsTabs.map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.value

          return (
            <button
              key={tab.value}
              type="button"
              role="tab"
              id={`settings-tab-${tab.value}`}
              aria-selected={isActive}
              aria-controls={`settings-panel-${tab.value}`}
              tabIndex={isActive ? 0 : -1}
              className={cn(
                'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
                isActive
                  ? 'bg-primary text-background shadow-sm'
                  : 'hover:bg-surface/50 hover:text-text-primary'
              )}
              onClick={() => setActiveTab(tab.value)}
              onKeyDown={(event) => handleTabKeyDown(event, tab.value)}
            >
              <Icon className="h-4 w-4" />
              {tab.label}
            </button>
          )
        })}
      </div>

      <div
        role="tabpanel"
        id="settings-panel-profile"
        aria-labelledby="settings-tab-profile"
        hidden={activeTab !== 'profile'}
      >
        <Card>
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
            <CardDescription>
              Update your account profile information and email address
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleProfileSubmit(onProfileSubmit)} className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="full_name">Full Name</Label>
                  <Input
                    id="full_name"
                    {...registerProfile('full_name')}
                    className={profileErrors.full_name ? 'border-red-500' : ''}
                  />
                  {profileErrors.full_name && (
                    <p className="text-sm text-red-500">{profileErrors.full_name.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    {...registerProfile('email')}
                    disabled
                    className="bg-surface/30"
                  />
                  <p className="text-xs text-text-muted">
                    Email cannot be changed. Contact support for assistance.
                  </p>
                </div>
              </div>

              <Separator />

              <div className="flex justify-end">
                <Button type="submit" disabled={isLoading}>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>

      <div
        role="tabpanel"
        id="settings-panel-notifications"
        aria-labelledby="settings-tab-notifications"
        hidden={activeTab !== 'notifications'}
      >
        <Card>
          <CardHeader>
            <CardTitle>Notification Preferences</CardTitle>
            <CardDescription>
              Configure how you receive notifications
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Email Notifications</Label>
                <p className="text-sm text-text-muted">
                  Receive notifications via email
                </p>
              </div>
              <Switch
                checked={emailNotifications}
                onCheckedChange={setEmailNotifications}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Push Notifications</Label>
                <p className="text-sm text-text-muted">
                  Receive notifications in the dashboard
                </p>
              </div>
              <Switch
                checked={pushNotifications}
                onCheckedChange={setPushNotifications}
              />
            </div>

            <Separator />

            <div className="space-y-4">
              <Label>Notification Types</Label>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Switch id="new-inquiries" defaultChecked />
                  <Label htmlFor="new-inquiries">New Inquiries</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="status-updates" defaultChecked />
                  <Label htmlFor="status-updates">Status Updates</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="system-alerts" defaultChecked />
                  <Label htmlFor="system-alerts">System Alerts</Label>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <Button>
                <Save className="h-4 w-4 mr-2" />
                Save Preferences
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <div
        role="tabpanel"
        id="settings-panel-security"
        aria-labelledby="settings-tab-security"
        hidden={activeTab !== 'security'}
      >
        <Card>
          <CardHeader>
            <CardTitle>Change Password</CardTitle>
            <CardDescription>
              Update your password to keep your account secure
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handlePasswordSubmit(onPasswordSubmit)} className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="current_password">Current Password</Label>
                  <Input
                    id="current_password"
                    type="password"
                    {...registerPassword('current_password')}
                    className={passwordErrors.current_password ? 'border-red-500' : ''}
                  />
                  {passwordErrors.current_password && (
                    <p className="text-sm text-red-500">{passwordErrors.current_password.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="new_password">New Password</Label>
                  <Input
                    id="new_password"
                    type="password"
                    {...registerPassword('new_password')}
                    className={passwordErrors.new_password ? 'border-red-500' : ''}
                  />
                  {passwordErrors.new_password && (
                    <p className="text-sm text-red-500">{passwordErrors.new_password.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirm_password">Confirm New Password</Label>
                  <Input
                    id="confirm_password"
                    type="password"
                    {...registerPassword('confirm_password')}
                    className={passwordErrors.confirm_password ? 'border-red-500' : ''}
                  />
                  {passwordErrors.confirm_password && (
                    <p className="text-sm text-red-500">{passwordErrors.confirm_password.message}</p>
                  )}
                </div>
              </div>

              <Separator />

              <div className="flex justify-end">
                <Button type="submit" disabled={isLoading}>
                  <Lock className="h-4 w-4 mr-2" />
                  Update Password
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Two-Factor Authentication</CardTitle>
            <CardDescription>
              Add an extra layer of security to your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Enable 2FA</Label>
                <p className="text-sm text-text-muted">
                  Protect your account with two-factor authentication
                </p>
              </div>
              <Button variant="outline">Setup 2FA</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
