'use client'
import React, { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { DataLoader, Booking } from '@/data/listings'
import { addToast } from '@heroui/toast'
import type { CustomSession } from '@/types'
import { 
  Calendar, 
  MapPin, 
  Clock, 
  // PropertyIcon, 
  ChevronRight, 
  Trash2, 
  Info, 
  ArrowLeft,
  DollarSign,
  Users
} from 'lucide-react'
import { Button } from '@heroui/button'
import { Chip } from '@heroui/chip'
import { Image } from '@heroui/image'
import { Card, CardBody } from '@heroui/card'
import Link from 'next/link'
import { isAxiosError } from 'axios'

export default function MyBookingsPage() {
  const { data: session }: { data: CustomSession | null } = useSession()
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(false)
  const [cancellingId, setCancellingId] = useState<string | null>(null)
  // console.log("from bookings", session)
  const dataLoader = new DataLoader()

  const fetchBookings = async () => {
    if (!session?.user?.djangoAccess) return
    setLoading(true)
    try {
      // @ts-ignore
      const data = await dataLoader.getUserBookings(session.user.djangoAccess)
      // Filter to only show bookings where the user is the one who booked (buyer)
      // The endpoint /booking/my/ returns both buyer and owner bookings
      const myReservations = data.filter(b => b.user.email === session.user?.email)
      setBookings(myReservations)
    } catch (error) {
      console.error('Error fetching bookings:', error)
      addToast({ title: 'Error', color: 'danger', description: 'Failed to load your bookings.' })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (session?.user?.djangoAccess) {
      fetchBookings()
    }
  }, [session?.user?.djangoAccess])

  const handleCancel = async (id: string) => {
    if (!session?.user?.djangoAccess) return
    setCancellingId(id)
    try {
      // Per user request, use setBookingStatus for cancellation
      // @ts-ignore
      const success = await dataLoader.cancelBooking(id, session.user.djangoAccess)
      if (success) {
        addToast({ title: 'Booking Cancelled', color: 'success', description: 'Your reservation has been cancelled.' })
        fetchBookings()
      }
    } catch (e) {
      if (isAxiosError(e)) {
        addToast({ title: 'Cancellation Failed', color: 'danger', description: e.response?.data?.message || 'Could not cancel booking.' })
      } else {
        addToast({ title: 'Error', color: 'danger', description: 'An unexpected error occurred.' })
      }
    } finally {
      setCancellingId(null)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'success'
      case 'pending': return 'warning'
      case 'cancelled': return 'danger'
      case 'rejected': return 'danger'
      default: return 'default'
    }
  }

  if (!session) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-20 h-20 rounded-3xl bg-indigo-50 flex items-center justify-center mb-6 text-indigo-500">
          <Info size={40} />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Please Sign In</h1>
        <p className="text-gray-500 mb-8 max-w-sm">You need to be logged in to view and manage your property bookings.</p>
        <Link href="/login">
          <Button size="lg" className="font-bold px-8" style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', color: '#fff' }}>
            Sign In Now
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div className="space-y-2">
          <Link href="/listings" className="text-sm font-semibold text-indigo-600 flex items-center gap-1 hover:gap-2 transition-all">
            <ArrowLeft size={16} /> Back to Listings
          </Link>
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">My Bookings</h1>
          <p className="text-gray-500 text-lg">Manage your property reservations and travel plans.</p>
        </div>
        
        <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-2xl border border-gray-100">
          <div className="text-right">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Total Bookings</p>
            <p className="text-2xl font-black text-gray-900">{bookings.length}</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-600">
            <Calendar size={24} />
          </div>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-80 rounded-3xl bg-gray-50 animate-pulse border border-gray-100" />
          ))}
        </div>
      ) : bookings.length === 0 ? (
        <Card className="border-none shadow-none bg-gray-50 rounded-3xl py-20">
          <CardBody className="flex flex-col items-center justify-center text-center">
            <div className="w-24 h-24 rounded-full bg-white flex items-center justify-center mb-6 shadow-sm">
              <Calendar size={40} className="text-gray-300" />
            </div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">No bookings yet</h2>
            <p className="text-gray-500 mb-8 max-w-sm">Travel goals? Start exploring properties and book your next stay with RentEase.</p>
            <Link href="/listings">
              <Button size="lg" className="font-bold px-8 rounded-2xl" style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', color: '#fff' }}>
                Explore Properties
              </Button>
            </Link>
          </CardBody>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {bookings.map((booking) => (
            <div 
              key={booking.id} 
              className="group flex flex-col bg-white rounded-3xl overflow-hidden border border-gray-100 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2"
            >
              {/* Image Header */}
              <div className="relative h-48 overflow-hidden">
                <Image 
                  // @ts-ignore
                  src={booking.property?.image || booking.property?.imageUrl} 
                  alt={booking.property?.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  removeWrapper
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute top-4 left-4">
                  <Chip 
                    size="sm" 
                    variant="flat" 
                    color={getStatusColor(booking.status)}
                    className="font-bold capitalize backdrop-blur-md bg-white/90"
                  >
                    {booking.status}
                  </Chip>
                </div>
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-white font-bold text-lg leading-tight truncate">{booking.property?.name}</h3>
                  <div className="flex items-center gap-1 text-white/80 text-xs mt-1">
                    <MapPin size={12} />
                    <span className="truncate capitalize">{booking.property?.location}</span>
                  </div>
                </div>
              </div>

              {/* Details Content */}
              <div className="p-6 space-y-5 flex-1 flex flex-col">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 rounded-2xl bg-gray-50 border border-gray-100">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Check-in</p>
                    <p className="text-sm font-bold text-gray-800">{new Date(booking.start_date).toLocaleDateString()}</p>
                  </div>
                  <div className="p-3 rounded-2xl bg-gray-50 border border-gray-100">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Check-out</p>
                    <p className="text-sm font-bold text-gray-800">{new Date(booking.end_date).toLocaleDateString()}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-orange-500">
                      <Users size={18} />
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 font-medium">Guests</p>
                      <p className="text-sm font-bold text-gray-800">{booking.guests} People</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-400 font-medium">Total Paid</p>
                    <p className="text-lg font-black text-indigo-600">D{booking.total_price}</p>
                  </div>
                </div>

                {booking.payment_state === 'requires_payment' && booking.payment_link && (
                  <div className="mb-4">
                    <a href={booking.payment_link} target="_blank" rel="noreferrer">
                      <Button 
                        fullWidth 
                        variant="flat" 
                        className="font-bold h-11 rounded-xl"
                        style={{ background: 'rgba(16,185,129,0.08)', color: '#10b981' }}
                      >
                        Complete Payment
                      </Button>
                    </a>
                  </div>
                )}

                <div className="pt-4 mt-auto border-t border-gray-50 flex items-center gap-3">
                  <Link href={`/listings/property/${booking.property?.id}`} className="flex-1">
                    <Button 
                      fullWidth 
                      variant="flat" 
                      className="font-bold h-11 rounded-xl"
                      style={{ background: 'rgba(99,102,241,0.06)', color: '#6366f1' }}
                    >
                      View Property
                    </Button>
                  </Link>
                  
                  {booking.status === 'confirmed' ? (
                    <div className="flex items-center gap-2 px-4 py-2 rounded-xl" style={{ background: 'rgba(34,197,94,0.1)' }}>
                      <span style={{ color: '#22c55e' }}>✓</span>
                      <span className="text-sm font-semibold text-emerald-700">Accepted</span>
                    </div>
                  ) : booking.status !== 'cancelled' && booking?.status !== 'rejected' ? (
                    <Button 
                      isIconOnly 
                      color="danger" 
                      variant="light"
                      className="h-11 w-11 rounded-xl flex-shrink-0"
                      isLoading={cancellingId === booking.id}
                      onPress={() => handleCancel(booking.id)}
                    >
                      <Trash2 size={18} />
                    </Button>
                  ) : null}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
