// app/admin/layout.tsx
'use client'

import { useEffect, useRef, useState } from 'react'
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
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { NotificationsPopover } from '@/components/admin/notifications-popover'
import { createClient } from '@/lib/supabase/client'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/inquiries', label: 'Inquiries', icon: Inbox },
  { href: '/admin/notifications', label: 'Notifications', icon: Bell },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
]

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [collapsed, setCollapsed] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const userMenuRef = useRef<HTMLDivElement>(null)
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

  useEffect(() => {
    if (!userMenuOpen) return

    const handlePointerDown = (event: PointerEvent) => {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target as Node)
      ) {
        setUserMenuOpen(false)
      }
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setUserMenuOpen(false)
      }
    }

    document.addEventListener('pointerdown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [userMenuOpen])

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
                    <Button
                      asChild
                      variant="ghost"
                      className={cn(
                        'w-full justify-start',
                        collapsed ? 'px-2' : '',
                        isActive && 'bg-primary/10 text-primary hover:bg-primary/20'
                      )}
                    >
                      <Link href={item.href}>
                        <Icon className={cn('h-5 w-5', collapsed ? 'mx-auto' : 'mr-3')} />
                        {!collapsed && item.label}
                      </Link>
                    </Button>
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
              <div ref={userMenuRef} className="relative">
                <Button
                  type="button"
                  variant="ghost"
                  className="relative h-8 w-8 rounded-full"
                  aria-haspopup="menu"
                  aria-expanded={userMenuOpen}
                  aria-controls="admin-user-menu"
                  onClick={() => setUserMenuOpen((open) => !open)}
                >
                  <span className="sr-only">Open admin user menu</span>
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-primary/10 text-primary">
                      AD
                    </AvatarFallback>
                  </Avatar>
                </Button>

                {userMenuOpen && (
                  <div
                    id="admin-user-menu"
                    role="menu"
                    className="absolute right-0 top-full z-50 mt-2 w-56 overflow-hidden rounded-md border border-white/5 bg-surface p-1 text-text-primary shadow-md"
                  >
                    <div className="px-2 py-1.5 text-sm font-semibold text-text-primary">
                      Admin User
                    </div>
                    <div className="-mx-1 my-1 h-px bg-white/5" />
                    <button
                      type="button"
                      role="menuitem"
                      className="relative flex w-full select-none items-center rounded-sm px-2 py-1.5 text-left text-sm outline-none transition-colors hover:bg-primary/10 hover:text-primary focus:bg-primary/10 focus:text-primary"
                      onClick={() => {
                        setUserMenuOpen(false)
                        router.push('/admin/settings')
                      }}
                    >
                      <User className="mr-2 h-4 w-4" />
                      Profile Settings
                    </button>
                    <button
                      type="button"
                      role="menuitem"
                      className="relative flex w-full select-none items-center rounded-sm px-2 py-1.5 text-left text-sm text-red-500 outline-none transition-colors hover:bg-red-500/10 hover:text-red-400 focus:bg-red-500/10 focus:text-red-400"
                      onClick={() => {
                        setUserMenuOpen(false)
                        handleLogout()
                      }}
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
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
