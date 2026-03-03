// app/admin/layout.tsx
'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import {
  LayoutDashboard,
  Inbox,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Bell,
  User,
  Search,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { NotificationsPopover } from '@/components/admin/notifications-popover'
import { createClient } from '@/lib/supabase/client'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/inquiries', label: 'Inquiries', icon: Inbox },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
]

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [collapsed, setCollapsed] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  // Check if current path is login page
  const isLoginPage = pathname === '/admin/login'

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      router.push('/admin/login')
      router.refresh()
      toast.success('Logged out successfully')
    } catch (error) {
      toast.error('Error logging out')
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/admin/inquiries?search=${encodeURIComponent(searchQuery)}`)
    }
  }

  // If it's the login page, render without the admin layout
  if (isLoginPage) {
    return <>{children}</>
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside
        className={cn(
          'fixed left-0 top-0 h-full bg-surface border-r border-white/5 transition-all duration-300 z-30',
          collapsed ? 'w-20' : 'w-64'
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className={cn(
            'p-4 border-b border-white/5 flex items-center',
            collapsed ? 'justify-center' : 'justify-center'
          )}>
            <Link href="/admin" className="inline-block">
              <Image
                src={collapsed ? "/assets/official-logov2.png" : "/assets/text-logo.png"}
                alt="Teknodeya"
                width={collapsed ? 40 : 150}
                height={collapsed ? 40 : 60}
                className={cn(
                  'transition-all duration-300',
                  collapsed ? 'h-10 w-13' : 'h-13 w-auto'
                )}
              />
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4">
            <ul className="space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href || 
                  (item.href !== '/admin' && pathname?.startsWith(item.href))

                return (
                  <li key={item.href}>
                    <Link href={item.href}>
                      <Button
                        variant="ghost"
                        className={cn(
                          'w-full justify-start',
                          collapsed ? 'px-2' : '',
                          isActive && 'bg-primary/10 text-primary hover:bg-primary/20'
                        )}
                      >
                        <Icon className={cn('h-5 w-5', collapsed ? 'mx-auto' : 'mr-3')} />
                        {!collapsed && item.label}
                      </Button>
                    </Link>
                  </li>
                )
              })}
            </ul>
          </nav>

          {/* Logout */}
          <div className="p-4 border-t border-white/5">
            <Button
              variant="ghost"
              className={cn(
                'w-full justify-start text-red-500 hover:text-red-400 hover:bg-red-500/10',
                collapsed ? 'px-2' : ''
              )}
              onClick={handleLogout}
            >
              <LogOut className={cn('h-5 w-5', collapsed ? 'mx-auto' : 'mr-3')} />
              {!collapsed && 'Logout'}
            </Button>
          </div>

          {/* Collapse Toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute -right-3 top-20 bg-surface border border-white/5 rounded-full"
            onClick={() => setCollapsed(!collapsed)}
          >
            {collapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className={cn(
        'flex-1 transition-all duration-300',
        collapsed ? 'ml-20' : 'ml-64'
      )}>
        {/* Top Bar */}
        <header className="sticky top-0 z-20 bg-surface/80 backdrop-blur-sm border-b border-white/5">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center flex-1">
              <form onSubmit={handleSearch} className="relative w-96">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-text-muted" />
                <Input
                  placeholder="Search inquiries..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </form>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Notifications */}
              <NotificationsPopover />

              {/* User Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-primary/10 text-primary">
                        AD
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>Admin User</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => router.push('/admin/settings')}>
                    <User className="mr-2 h-4 w-4" />
                    Profile Settings
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout} className="text-red-500">
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        {/* Page Title */}
        <div className="px-6 py-4 border-b border-white/5">
          <h1 className="text-2xl font-heading font-bold">
            {navItems.find(item => 
              item.href === pathname || 
              (pathname?.startsWith(item.href) && item.href !== '/admin')
            )?.label || 'Dashboard'}
          </h1>
        </div>

        {/* Page Content */}
        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  )
}