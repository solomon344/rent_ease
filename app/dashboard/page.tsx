'use client'
import React, { useState } from 'react'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import Api from '@/lib/api'
import { Booking, DataLoader } from '@/data/listings'
import { addToast } from '@heroui/toast'
import {
  Home,
  DollarSign,
  BarChart3,
  Calendar,
  Plus,
  ArrowUpRight,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
  Building2,
} from 'lucide-react'
import { Button } from '@heroui/button'
import { Chip } from '@heroui/chip'
import { Avatar } from '@heroui/avatar'
import type { CustomSession } from '@/types'

export default function OverviewPage() {
  const { data: session }: { data: CustomSession | null } = useSession()
  const [listings, setListings] = React.useState<any[]>([])
  const [reservations, setReservations] = React.useState<Booking[]>([])

  React.useEffect(() => {
  
    // @ts-ignore
   if (session?.user?.djangoAccess){
     Api.get(`/properties/?owner__user__email=${session?.user?.email}`, { headers: { Authorization: `Token ${session?.user?.djangoAccess}` } }).then(res => setListings(res.data))
    // @ts-ignore
    Api.get(`/booking/?property__owner__email=${session?.user?.email}`, { headers: { Authorization: `Token ${session?.user?.djangoAccess}` } }).then(res => setReservations(res.data))
   }
  }, [session?.user?.djangoAccess])

  const totalProperties = listings.length
  const pendingReservations = reservations.filter(r => r.status === 'pending').length
  const confirmedReservations = reservations.filter(r => r.status === 'confirmed').length
  const totalRevenue = reservations
    .filter(r => r.status === 'confirmed')
    .reduce((sum, r) => sum + Number(r.total_price || 0), 0)
  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(value)

  const statCards = [
    {
      label: 'Total Properties',
      value: totalProperties,
      icon: Building2,
      gradient: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
      bg: 'rgba(99,102,241,0.08)',
      border: 'rgba(99,102,241,0.2)',
      change: '+2 this month',
    },
    {
      label: 'Pending Bookings',
      value: pendingReservations,
      icon: Clock,
      gradient: 'linear-gradient(135deg, #f59e0b, #f97316)',
      bg: 'rgba(245,158,11,0.08)',
      border: 'rgba(245,158,11,0.2)',
      change: 'Needs review',
    },
    {
      label: 'Confirmed Bookings',
      value: confirmedReservations,
      icon: CheckCircle2,
      gradient: 'linear-gradient(135deg, #10b981, #059669)',
      bg: 'rgba(16,185,129,0.08)',
      border: 'rgba(16,185,129,0.2)',
      change: 'All time',
    },
    {
      label: 'Est. Revenue',
      value: formatCurrency(totalRevenue),
      icon: DollarSign,
      gradient: 'linear-gradient(135deg, #3b82f6, #2563eb)',
      bg: 'rgba(59,130,246,0.08)',
      border: 'rgba(59,130,246,0.2)',
      change: 'Analytics coming',
    },
  ]

  return (
    <div className="p-8">
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-semibold uppercase tracking-widest px-2 py-1 rounded-full" style={{ background: 'rgba(99,102,241,0.1)', color: '#6366f1' }}>
            Dashboard
          </span>
        </div>
        <h1 className="text-3xl font-bold text-gray-900">Good morning! 👋</h1>
        <p className="text-gray-500 mt-1">Here's what's happening with your properties today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
        {statCards.map((card, index) => (
          <div
            key={index}
            className="rounded-2xl p-5 transition-all duration-300 hover:-translate-y-0.5"
            style={{
              background: '#fff',
              border: `1px solid ${card.border}`,
              boxShadow: `0 4px 20px ${card.bg}`,
            }}
          >
            <div className="flex items-start justify-between mb-4">
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center"
                style={{ background: card.gradient, boxShadow: `0 4px 12px ${card.bg}` }}
              >
                <card.icon size={20} className="text-white" />
              </div>
              <ArrowUpRight size={16} className="text-gray-300" />
            </div>
            <p className="text-2xl font-bold text-gray-900 mb-1">{card.value}</p>
            <p className="text-sm text-gray-500 mb-2">{card.label}</p>
            <p className="text-xs font-medium" style={{ color: '#6366f1' }}>{card.change}</p>
          </div>
        ))}
      </div>

      {/* Two column grid */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Recent Reservations */}
        <div className="lg:col-span-3 rounded-2xl bg-white p-6" style={{ border: '1px solid #e2e8f0', boxShadow: '0 4px 20px rgba(0,0,0,0.04)' }}>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-gray-900">Recent Reservations</h3>
              <p className="text-sm text-gray-500">Latest booking requests</p>
            </div>
            <Link
              href="/dashboard/reservations"
              className="flex items-center gap-1 text-sm font-medium hover:gap-2 transition-all duration-200"
              style={{ color: '#6366f1' }}
            >
              View all <ChevronRight size={14} />
            </Link>
          </div>

          <div className="space-y-3">
            {reservations.length === 0 ? (
              <div className="text-center py-10">
                <Calendar size={36} className="mx-auto text-gray-200 mb-3" />
                <p className="text-gray-400 font-medium">No reservations yet</p>
                <p className="text-sm text-gray-300 mt-1">Bookings from guests will appear here</p>
              </div>
            ) : (
              reservations.slice(0, 5).map((r) => (
                <div key={r.id} className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 transition-colors">
                  <Avatar
                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${r.user?.first_name}`}
                    size="sm"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-800 text-sm truncate">{r.user?.first_name} {r.user?.last_name}</p>
                    <p className="text-xs text-gray-400 truncate">{r.property?.name}</p>
                  </div>
                  <div className="text-right">
                    <Chip
                      size="sm"
                      variant="flat"
                      color={r.status === 'confirmed' ? 'success' : r.status === 'pending' ? 'warning' : 'danger'}
                    >
                      {r.status}
                    </Chip>
                    <p className="text-xs text-gray-400 mt-1">{r.start_date}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="lg:col-span-2 rounded-2xl bg-white p-6" style={{ border: '1px solid #e2e8f0', boxShadow: '0 4px 20px rgba(0,0,0,0.04)' }}>
          <div className="mb-6">
            <h3 className="text-lg font-bold text-gray-900">Quick Actions</h3>
            <p className="text-sm text-gray-500">Get things done fast</p>
          </div>

          <div className="space-y-3">
            <Link
              href="/dashboard/create"
              className="flex items-center gap-4 p-4 rounded-xl transition-all duration-200 hover:-translate-y-0.5 group"
              style={{
                background: 'linear-gradient(135deg, rgba(99,102,241,0.08), rgba(139,92,246,0.06))',
                border: '1px solid rgba(99,102,241,0.2)',
              }}
            >
              <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
                <Plus size={18} className="text-white" />
              </div>
              <div>
                <p className="font-semibold text-gray-800 text-sm">Add New Property</p>
                <p className="text-xs text-gray-500">List a property for rent</p>
              </div>
              <ChevronRight size={16} className="ml-auto text-indigo-400" />
            </Link>

            <Link
              href="/dashboard/properties"
              className="flex items-center gap-4 p-4 rounded-xl transition-all duration-200 hover:-translate-y-0.5"
              style={{
                background: 'rgba(16,185,129,0.06)',
                border: '1px solid rgba(16,185,129,0.2)',
              }}
            >
              <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}>
                <Building2 size={18} className="text-white" />
              </div>
              <div>
                <p className="font-semibold text-gray-800 text-sm">Manage Properties</p>
                <p className="text-xs text-gray-500">View and edit listings</p>
              </div>
              <ChevronRight size={16} className="ml-auto text-emerald-400" />
            </Link>

            <Link
              href="/dashboard/reservations"
              className="flex items-center gap-4 p-4 rounded-xl transition-all duration-200 hover:-translate-y-0.5"
              style={{
                background: 'rgba(245,158,11,0.06)',
                border: '1px solid rgba(245,158,11,0.2)',
              }}
            >
              <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'linear-gradient(135deg, #f59e0b, #f97316)' }}>
                <Calendar size={18} className="text-white" />
              </div>
              <div>
                <p className="font-semibold text-gray-800 text-sm">Reservations</p>
                <p className="text-xs text-gray-500">
                  {pendingReservations > 0 ? `${pendingReservations} pending review` : 'No pending requests'}
                </p>
              </div>
              <ChevronRight size={16} className="ml-auto text-amber-400" />
            </Link>

            <Link
              href="/listings"
              className="flex items-center gap-4 p-4 rounded-xl transition-all duration-200 hover:-translate-y-0.5"
              style={{
                background: 'rgba(59,130,246,0.06)',
                border: '1px solid rgba(59,130,246,0.2)',
              }}
            >
              <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'linear-gradient(135deg, #3b82f6, #2563eb)' }}>
                <Home size={18} className="text-white" />
              </div>
              <div>
                <p className="font-semibold text-gray-800 text-sm">Public Listings</p>
                <p className="text-xs text-gray-500">View your live listings</p>
              </div>
              <ChevronRight size={16} className="ml-auto text-blue-400" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}