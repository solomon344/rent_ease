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
  User,
  Settings,
  Camera,
  Upload,
  Image as ImageIcon
} from 'lucide-react'
import { Button } from '@heroui/button'
import { Chip } from '@heroui/chip'
import { Avatar } from '@heroui/avatar'
import type { CustomSession } from '@/types'

export default function OverviewPage() {
  const { data: session }: { data: CustomSession | null } = useSession()
  const [listings, setListings] = React.useState<any[]>([])
  const [reservations, setReservations] = React.useState<Booking[]>([])
  const [profileImage, setProfileImage] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)

  React.useEffect(() => {
    if (session?.user?.djangoAccess) {
      Api.get(`/properties/?owner__user__email=${session?.user?.email}`, { headers: { Authorization: `Token ${session?.user?.djangoAccess}` } }).then(res => setListings(res.data))
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
      currency: 'GMD',
      maximumFractionDigits: 0,
    }).format(value)

  const handleProfileImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return

    const file = e.target.files[0]
    if (!file.type.match('image.*')) {
      addToast({ title: 'Invalid file type', description: 'Please upload an image file', variant: 'solid', color: 'danger' })
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      addToast({ title: 'File too large', description: 'Image must be less than 5MB', variant: 'solid', color: 'danger' })
      return
    }

    setIsUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)

      // In a real app, you would send this to your backend API
      // const response = await Api.post('/upload-profile-image', formData, {
      //   headers: {
      //     'Content-Type': 'multipart/form-data',
      //     Authorization: `Token ${session?.user?.djangoAccess}`
      //   }
      // })

      // For demo purposes, we'll just use a placeholder
      const reader = new FileReader()
      reader.onload = (event) => {
        setProfileImage(event.target?.result as string)
        addToast({ title: 'Profile image updated', description: 'Your profile picture has been updated successfully', variant: 'solid', color: 'success' })
      }
      reader.readAsDataURL(file)
    } catch (error) {
      addToast({ title: 'Upload failed', description: 'Failed to upload profile image', variant: 'solid', color: 'danger' })
    } finally {
      setIsUploading(false)
    }
  }

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
        {/* Profile Section */}
        <div className="lg:col-span-2 rounded-2xl bg-white p-6" style={{ border: '1px solid #e2e8f0', boxShadow: '0 4px 20px rgba(0,0,0,0.04)' }}>
          <div className="mb-6">
            <h3 className="text-lg font-bold text-gray-900">Profile</h3>
            <p className="text-sm text-gray-500">Manage your account settings</p>
          </div>

          <div className="space-y-6">
            {/* Profile Image */}
            <div className="flex flex-col items-center gap-4">
              <div className="relative">
                <Avatar
                  src={profileImage || `https://api.dicebear.com/7.x/avataaars/svg?seed=${session?.user?.name}`}
                  size="lg"
                  className="w-24 h-24"
                />
                <label
                  htmlFor="profile-image-upload"
                  className="absolute bottom-0 right-0 bg-white rounded-full p-1.5 shadow-md cursor-pointer hover:bg-gray-50 transition-colors"
                >
                  <Camera size={16} className="text-gray-600" />
                  <input
                    id="profile-image-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleProfileImageUpload}
                    disabled={isUploading}
                  />
                </label>
              </div>
              <div className="text-center">
                <h4 className="font-semibold text-gray-800">{session?.user?.name}</h4>
                <p className="text-sm text-gray-500">{session?.user?.email}</p>
              </div>
            </div>

            {/* Profile Actions */}
            <div className="space-y-3">
              <Link
                href="/dashboard/settings"
                className="flex items-center gap-4 p-4 rounded-xl transition-all duration-200 hover:-translate-y-0.5"
                style={{
                  background: 'rgba(99,102,241,0.06)',
                  border: '1px solid rgba(99,102,241,0.2)',
                }}
              >
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
                  <Settings size={18} className="text-white" />
                </div>
                <div>
                  <p className="font-semibold text-gray-800 text-sm">Account Settings</p>
                  <p className="text-xs text-gray-500">Update your profile information</p>
                </div>
                <ChevronRight size={16} className="ml-auto text-indigo-400" />
              </Link>

              <Link
                href="/dashboard/payouts"
                className="flex items-center gap-4 p-4 rounded-xl transition-all duration-200 hover:-translate-y-0.5"
                style={{
                  background: 'rgba(59,130,246,0.06)',
                  border: '1px solid rgba(59,130,246,0.2)',
                }}
              >
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'linear-gradient(135deg, #3b82f6, #2563eb)' }}>
                  <DollarSign size={18} className="text-white" />
                </div>
                <div>
                  <p className="font-semibold text-gray-800 text-sm">Payouts</p>
                  <p className="text-xs text-gray-500">View your earnings and payout history</p>
                </div>
                <ChevronRight size={16} className="ml-auto text-blue-400" />
              </Link>
            </div>
          </div>
        </div>

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
      </div>
    </div>
  )
}