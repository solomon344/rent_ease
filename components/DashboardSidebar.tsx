'use client'
import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut, useSession } from 'next-auth/react'
import {
  LayoutDashboard,
  Home,
  Calendar,
  BarChart3,
  Settings,
  LogOut,
  Bell,
  ChevronRight,
  Building2,
  Sparkles,
} from 'lucide-react'
import Logo, { LogoIcon } from './Logo'

const sidebarItems = [
  {
    id: 'overview',
    label: 'Overview',
    icon: LayoutDashboard,
    href: '/dashboard',
    badge: null,
  },
  {
    id: 'properties',
    label: 'Properties',
    icon: Building2,
    href: '/dashboard/properties',
    badge: null,
  },
  {
    id: 'reservations',
    label: 'Reservations',
    icon: Calendar,
    href: '/dashboard/reservations',
    badge: null,
  },
  {
    id: 'analytics',
    label: 'Analytics',
    icon: BarChart3,
    href: '/dashboard/analytics',
    badge: null,
  },
]

const DashboardSidebar = () => {
  const pathname = usePathname()
  const { data: session } = useSession()

  const isActive = (href: string) => {
    if (href === '/dashboard') return pathname === '/dashboard'
    return pathname.startsWith(href)
  }

  return (
    <div
      className="w-72 min-h-screen flex flex-col"
      style={{
        background: 'linear-gradient(180deg, #0f1629 0%, #1a2340 50%, #0f1629 100%)',
        borderRight: '1px solid rgba(99,102,241,0.15)',
      }}
    >
      {/* Logo / Brand */}
      <div className="px-6 pt-8 pb-4">
        <Logo width={160} height={60} />
        <p className="text-xs px-2" style={{ color: 'rgba(148,163,184,0.7)' }}>
          Admin Dashboard
        </p>
      </div>

      {/* User Profile */}
      <div className="mx-4 mb-6 px-4 py-3 rounded-xl" style={{ background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.15)' }}>
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0"
            style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}
          >
            {/* @ts-ignore */}
            {session?.user?.name?.[0]?.toUpperCase() || session?.user?.email?.[0]?.toUpperCase() || 'A'}
          </div>
          <div className="min-w-0">
            {/* @ts-ignore */}
            <p className="text-white text-sm font-semibold truncate">{session?.user?.name || session?.user?.email?.split('@')[0] || 'Admin'}</p>
            <p className="text-xs truncate" style={{ color: 'rgba(148,163,184,0.7)' }}>Property Manager</p>
          </div>
          <div
            className="ml-auto w-2 h-2 rounded-full flex-shrink-0"
            style={{ background: '#22c55e', boxShadow: '0 0 6px #22c55e' }}
          />
        </div>
      </div>

      {/* Divider label */}
      <div className="px-6 mb-3">
        <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: 'rgba(148,163,184,0.4)' }}>
          Navigation
        </span>
      </div>

      {/* Nav Items */}
      <nav className="flex-1 px-3">
        <div className="space-y-1">
          {sidebarItems.map((item) => {
            const active = isActive(item.href)
            return (
              <Link
                key={item.id}
                href={item.href}
                className="flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 group"
                style={{
                  background: active
                    ? 'linear-gradient(135deg, rgba(99,102,241,0.25), rgba(139,92,246,0.2))'
                    : 'transparent',
                  border: active
                    ? '1px solid rgba(99,102,241,0.35)'
                    : '1px solid transparent',
                }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200"
                    style={{
                      background: active
                        ? 'linear-gradient(135deg, #6366f1, #8b5cf6)'
                        : 'rgba(148,163,184,0.08)',
                    }}
                  >
                    <item.icon
                      size={16}
                      style={{ color: active ? '#fff' : 'rgba(148,163,184,0.6)' }}
                    />
                  </div>
                  <span
                    className="text-sm font-medium transition-colors"
                    style={{ color: active ? '#fff' : 'rgba(148,163,184,0.75)' }}
                  >
                    {item.label}
                  </span>
                </div>
                {active && (
                  <ChevronRight size={14} className="text-indigo-400" />
                )}
                {item.badge && item.badge > 0 && (
                  <span
                    className="text-xs font-bold px-2 py-0.5 rounded-full"
                    style={{ background: '#ef4444', color: '#fff' }}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            )
          })}
        </div>

        {/* Divider */}
        <div className="my-5 mx-2" style={{ height: '1px', background: 'rgba(148,163,184,0.08)' }} />

        {/* Secondary items */}
        <div className="space-y-1">
          {/* <button
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-left group"
            style={{ border: '1px solid transparent' }}
            disabled
          >
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(148,163,184,0.08)' }}>
              <BarChart3 size={16} style={{ color: 'rgba(148,163,184,0.35)' }} />
            </div>
            <span className="text-sm font-medium" style={{ color: 'rgba(148,163,184,0.35)' }}>
              Analytics <span className="text-xs ml-1">(Soon)</span>
            </span>
          </button> */}
          <button
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-left"
            style={{ border: '1px solid transparent' }}
            disabled
          >
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(148,163,184,0.08)' }}>
              <Settings size={16} style={{ color: 'rgba(148,163,184,0.35)' }} />
            </div>
            <span className="text-sm font-medium" style={{ color: 'rgba(148,163,184,0.35)' }}>
              Settings <span className="text-xs ml-1">(Soon)</span>
            </span>
          </button>
        </div>
      </nav>

      {/* Footer / Logout */}
      <div className="p-4 mx-3 mb-6 rounded-xl" style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.12)' }}>
        <button
          onClick={() => signOut({ callbackUrl: '/' })}
          className="w-full flex items-center gap-3 px-2 py-1 rounded-lg transition-all duration-200 group"
        >
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(239,68,68,0.12)' }}>
            <LogOut size={16} style={{ color: '#ef4444' }} />
          </div>
          <span className="text-sm font-medium" style={{ color: '#ef4444' }}>
            Sign Out
          </span>
        </button>
      </div>
    </div>
  )
}

export default DashboardSidebar
