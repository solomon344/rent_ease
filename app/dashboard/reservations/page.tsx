'use client'
import React, { useState } from 'react'
import { useSession } from 'next-auth/react'
import Api from '@/lib/api'
import { Booking, DataLoader } from '@/data/listings'
import { addToast } from '@heroui/toast'
import {
  Calendar,
  Search,
  CheckCircle,
  XCircle,
  Eye,
  Filter,
  Clock,
  Users,
  DollarSign,
  ChevronDown,
} from 'lucide-react'
import { Button } from '@heroui/button'
import { Input } from '@heroui/input'
import { Avatar } from '@heroui/avatar'
import { Chip } from '@heroui/chip'
import { Popover, PopoverContent, PopoverTrigger } from '@heroui/popover'
import { User } from '@heroui/user'
import { Image } from '@heroui/image'
import { isAxiosError } from 'axios'
import type {CustomSession} from '@/types'

const dataLoader = new DataLoader()

function ReservationCard({
  reservation,
  onAction,
}: {
  reservation: Booking
  onAction: (id: string, status: 'confirmed' | 'rejected') => Promise<void>
}) {
  const [loading1, setLoading1] = useState(false)
  const [loading2, setLoading2] = useState(false)

  const statusConfig = {
    confirmed: { color: 'success' as const, label: 'Confirmed', bg: 'rgba(16,185,129,0.08)', border: 'rgba(16,185,129,0.2)' },
    pending: { color: 'warning' as const, label: 'Pending', bg: 'rgba(245,158,11,0.08)', border: 'rgba(245,158,11,0.2)' },
    rejected: { color: 'danger' as const, label: 'Rejected', bg: 'rgba(239,68,68,0.08)', border: 'rgba(239,68,68,0.2)' },
  }
  const cfg = statusConfig[reservation.status as keyof typeof statusConfig] || statusConfig.pending

  return (
    <div
      className="rounded-2xl bg-white p-5 transition-all duration-200 hover:shadow-lg"
      style={{ border: `1px solid ${cfg.border}`, background: cfg.bg }}
    >
      <div className="flex items-start gap-4">
        {/* Guest Info */}
        <Popover placement="right">
          <PopoverTrigger>
            <div className="cursor-pointer flex-shrink-0">
              <Avatar
                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${reservation.user?.first_name}`}
                size="md"
                className="ring-2 ring-white shadow-md"
              />
            </div>
          </PopoverTrigger>
          <PopoverContent className="p-4 rounded-xl shadow-xl" style={{ minWidth: 220 }}>
            <User
              name={`${reservation.user?.first_name} ${reservation.user?.last_name || ''}`}
              avatarProps={{
                src: `https://api.dicebear.com/7.x/avataaars/svg?seed=${reservation.user?.first_name}`,
                size: 'sm',
              }}
              description={
                <div className="mt-1 space-y-0.5">
                  <p className="text-xs text-gray-500">{reservation.user?.email}</p>
                  {reservation.user?.profile?.phone && (
                    <p className="text-xs text-gray-500">{reservation.user.profile.phone}</p>
                  )}
                </div>
              }
            />
          </PopoverContent>
        </Popover>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-3">
            <div>
              <p className="font-bold text-gray-900">{reservation.user?.first_name} {reservation.user?.last_name}</p>
              <p className="text-xs text-gray-500 truncate">{reservation.user?.email}</p>
            </div>
            <Chip size="sm" color={cfg.color} variant="flat" className="flex-shrink-0 font-semibold capitalize">
              {reservation.status}
            </Chip>
          </div>

          {/* Property Info */}
          <div className="flex items-center gap-3 mb-3 p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.7)', border: '1px solid rgba(0,0,0,0.05)' }}>
            <Popover placement="right">
              <PopoverTrigger>
                <div className="cursor-pointer w-14 h-10 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
                  <Image
                    // @ts-ignore
                    src={reservation.property?.image}
                    alt={reservation.property?.name}
                    className="w-full h-full object-cover"
                    removeWrapper
                  />
                </div>
              </PopoverTrigger>
              <PopoverContent className="p-3 rounded-xl" style={{ minWidth: 240 }}>
                <Image
                  // @ts-ignore
                  src={reservation.property?.image}
                  alt={reservation.property?.name}
                  className="w-full h-36 object-cover rounded-lg mb-2"
                  removeWrapper
                />
                <p className="font-semibold text-sm">{reservation.property?.name}</p>
              </PopoverContent>
            </Popover>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-gray-800 truncate">{reservation.property?.name}</p>
              <p className="text-xs text-gray-400">Property booking</p>
            </div>
          </div>

          {/* Details row */}
          <div className="grid grid-cols-3 gap-3 mb-4">
            <div className="text-center p-2 rounded-xl" style={{ background: 'rgba(99,102,241,0.06)', border: '1px solid rgba(99,102,241,0.12)' }}>
              <Calendar size={13} className="mx-auto mb-1" style={{ color: '#6366f1' }} />
              <p className="text-xs font-semibold text-gray-700">{reservation.start_date}</p>
              <p className="text-xs text-gray-400">Check-in</p>
            </div>
            <div className="text-center p-2 rounded-xl" style={{ background: 'rgba(99,102,241,0.06)', border: '1px solid rgba(99,102,241,0.12)' }}>
              <Calendar size={13} className="mx-auto mb-1" style={{ color: '#6366f1' }} />
              <p className="text-xs font-semibold text-gray-700">{reservation.end_date}</p>
              <p className="text-xs text-gray-400">Check-out</p>
            </div>
            <div className="text-center p-2 rounded-xl" style={{ background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.12)' }}>
              <DollarSign size={13} className="mx-auto mb-1" style={{ color: '#10b981' }} />
              <p className="text-xs font-semibold text-gray-700">D{reservation.total_price}</p>
              <p className="text-xs text-gray-400">Total</p>
            </div>
          </div>

          {/* Action Buttons */}
          {reservation.status === 'pending' && (
            <div className="flex gap-2">
              <Button
                size="sm"
                color="success"
                variant="flat"
                startContent={<CheckCircle size={14} />}
                isLoading={loading1}
                className="flex-1 font-semibold"
                onPress={async () => {
                  setLoading1(true)
                  await onAction(reservation.id, 'confirmed')
                  setLoading1(false)
                }}
              >
                Accept
              </Button>
              <Button
                size="sm"
                color="danger"
                variant="flat"
                startContent={<XCircle size={14} />}
                isLoading={loading2}
                className="flex-1 font-semibold"
                onPress={async () => {
                  setLoading2(true)
                  await onAction(reservation.id, 'rejected')
                  setLoading2(false)
                }}
              >
                Decline
              </Button>
            </div>
          )}
          {reservation.status === 'confirmed' && (
            <Button size="sm" variant="flat" className="w-full font-medium" style={{ color: '#6366f1', background: 'rgba(99,102,241,0.08)' }} startContent={<Eye size={14} />}>
              View Details
            </Button>
          )}
          {reservation.status === 'rejected' && (
            <div className="text-center">
              <p className="text-xs text-gray-400">This booking was declined</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function ReservationsPage() {
  const { data: session }:{ data: CustomSession | null } = useSession()
  const [reservations, setReservations] = React.useState<Booking[]>([])
  const [signal, setSignal] = useState(false)
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'pending' | 'confirmed' | 'rejected'| 'cancelled'>('all')

  React.useEffect(() => {
    // @ts-ignore
    if (session?.user?.djangoAccess){
      setLoading(true)
    // @ts-ignore
    Api.get(`/booking/?property__owner__email=${session?.user?.email}`, { headers: { Authorization: `Token ${session?.user?.djangoAccess}` } })
      .then(res => {
        setReservations(res.data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
    }
    
  }, [session?.user?.djangoAccess])

  const handleAction = async (id: string, status: 'confirmed' | 'rejected') => {
    try {
      // @ts-ignore
      const data = await dataLoader.setBookingStatus(id, status, session?.user?.djangoAccess)
      addToast({ title: 'Success', color: 'success', description: (data as any).message })
      setSignal(p => !p)
    } catch (e) {
      if (isAxiosError(e)) {
        addToast({ 
          title: 'Action Failed', 
          color: 'danger', 
          description: e.response?.data?.message || 'Something went wrong. Please try again.' 
        })
      } else {
        addToast({ title: 'Error', color: 'danger', description: 'An unexpected error occurred.' })
      }
    }
  }

  const tabs: { key: typeof filter; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'pending', label: 'Pending' },
    { key: 'confirmed', label: 'Confirmed' },
    { key: 'rejected', label: 'Rejected' },
    {key:"cancelled",label:"Cancelled"},
  ]

  const displayed = filter === 'all' ? reservations : reservations.filter(r => r.status === filter)
  const pendingCount = reservations.filter(r => r.status === 'pending').length

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-semibold uppercase tracking-widest px-2 py-1 rounded-full" style={{ background: 'rgba(245,158,11,0.1)', color: '#f59e0b' }}>
            Reservations
          </span>
          {pendingCount > 0 && (
            <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: '#f59e0b', color: '#fff' }}>
              {pendingCount} pending
            </span>
          )}
        </div>
        <h1 className="text-3xl font-bold text-gray-900">Reservations</h1>
        <p className="text-gray-500 mt-1">Review and manage all booking requests</p>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-6 p-1 rounded-xl w-fit" style={{ background: 'rgba(0,0,0,0.04)' }}>
        {tabs.map(tab => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key)}
            className="px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200"
            style={{
              background: filter === tab.key ? '#fff' : 'transparent',
              color: filter === tab.key ? '#6366f1' : '#6b7280',
              boxShadow: filter === tab.key ? '0 2px 8px rgba(0,0,0,0.08)' : 'none',
            }}
          >
            {tab.label}
            {tab.key === 'pending' && pendingCount > 0 && (
              <span className="ml-1.5 text-xs px-1.5 py-0.5 rounded-full font-bold" style={{ background: '#f59e0b', color: '#fff' }}>
                {pendingCount}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Loading */}
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {[1, 2, 3].map(i => (
            <div key={i} className="rounded-2xl bg-white p-5 animate-pulse h-64" style={{ border: '1px solid #e2e8f0' }} />
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && displayed.length === 0 && (
        <div className="text-center py-20">
          <div className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ background: 'rgba(245,158,11,0.08)' }}>
            <Calendar size={36} style={{ color: '#f59e0b' }} />
          </div>
          <h3 className="text-lg font-bold text-gray-800 mb-2">No {filter !== 'all' ? filter : ''} reservations</h3>
          <p className="text-gray-400">
            {filter === 'all' ? 'Booking requests from guests will appear here.' : `No ${filter} bookings at the moment.`}
          </p>
        </div>
      )}

      {/* Reservation Cards Grid */}
      {!loading && displayed.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {displayed.map(r => (
            <ReservationCard key={r.id} reservation={r} onAction={handleAction} />
          ))}
        </div>
      )}
    </div>
  )
}
