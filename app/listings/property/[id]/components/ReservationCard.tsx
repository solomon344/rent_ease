'use client'
import React, { useState, useEffect } from 'react'
import { StarIcon, Users, Shield, CheckCircle2 } from 'lucide-react'
import { Button } from '@heroui/button'
import { Divider } from '@heroui/divider'
import { DatePicker } from '@heroui/date-picker'
import { CalendarDate, getLocalTimeZone, today } from '@internationalized/date'
import { Listing, DataLoader } from '@/data/listings'
import { addToast } from '@heroui/toast'
import { Input } from '@heroui/input'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { isAxiosError } from 'axios'
import type { CustomSession } from "@/types/index"
interface ReservationCardProps {
  listing: Listing
}

const ReservationCard: React.FC<ReservationCardProps> = ({ listing }) => {
  const [checkIn, setCheckIn] = useState<CalendarDate | null>(null)
  const [checkOut, setCheckOut] = useState<CalendarDate | null>(null)
  const [guests, setGuests] = useState(1)
  const [loading, setLoading] = useState(false)
  const [userBooked, setUserBooked] = useState(false)

  const { data: session }:{ data: CustomSession | null} = useSession()
  const dataLoader = new DataLoader()

  useEffect(() => {
    const checkBookingStatus = async () => {
      if (!session?.user?.djangoAccess) return
      try {
        // @ts-ignore
        const myBookings = await dataLoader.getUserBookings(session.user.djangoAccess)
        const activeBooking = myBookings.find(
          b => b.property.id === listing.id && 
          b.user.email === session.user?.email && 
          (b.status === 'pending' || b.status === 'confirmed')
        )
        if (activeBooking) {
          setUserBooked(true)
        }
      } catch (error) {
        console.error('Error checking booking status:', error)
      }
    }
    checkBookingStatus()
  }, [session, listing.id])

  const nights = checkIn && checkOut
    ? Math.max(0, checkOut.toDate(getLocalTimeZone()).getTime() / 86400000 - checkIn.toDate(getLocalTimeZone()).getTime() / 86400000)
    : 0

  const subtotal = listing.price * nights
  const cleaningFee = listing.cleaningFee || 0
  const serviceFee = listing.serviceFee || 0
  const total = subtotal + cleaningFee + serviceFee

  const handleBook = async () => {
    setLoading(true)
    try {
      // @ts-ignore
      const success = await dataLoader.bookListing(listing, checkIn?.toString() || '', checkOut?.toString() || '', guests, total, session?.user?.access || '')
      if (success) {
        addToast({ title: 'Booking Submitted!', color: 'success', description: 'Your booking request has been sent to the host.' })
        setUserBooked(true)
      } else {
        addToast({ title: 'Booking Failed', color: 'danger', description: 'Something went wrong. Please try again.' })
      }
    } catch (e) {
      if (isAxiosError(e)) {
        addToast({ 
          title: 'Booking Error', 
          color: 'danger', 
          description: e.response?.data?.message || 'Unable to complete booking.' 
        })
      } else {
        addToast({ title: 'Error', color: 'danger', description: 'An unexpected error occurred.' })
      }
    } finally {
      setLoading(false)
    }
  }

  const booked = userBooked
  const canBook = checkIn && checkOut && guests > 0 && !booked

  return (
    <div
      className="rounded-2xl overflow-hidden sticky top-6"
      style={{
        background: '#fff',
        border: '1px solid #e2e8f0',
        boxShadow: '0 8px 40px rgba(99,102,241,0.12)',
      }}
    >
      {/* Price Header */}
      <div
        className="px-6 pt-6 pb-4"
        style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.06), rgba(139,92,246,0.04))' }}
      >
        <div className="flex items-end justify-between mb-1">
          <div>
            <span className="text-3xl font-extrabold text-gray-900">D{listing.price}</span>
            <span className="text-gray-500 text-sm ml-1">/ night</span>
          </div>
          {listing.rating && (
            <div className="flex items-center gap-1 px-3 py-1 rounded-xl" style={{ background: 'rgba(245,158,11,0.1)' }}>
              <StarIcon size={13} fill="#f59e0b" className="text-amber-400" />
              <span className="text-sm font-bold text-gray-800">{listing.rating}</span>
              {listing.reviewCount && (
                <span className="text-xs text-gray-500 ml-0.5">({listing.reviewCount})</span>
              )}
            </div>
          )}
        </div>
        {booked && (
          <div className="flex items-center gap-1.5 text-emerald-600 text-xs font-semibold mt-1">
            <CheckCircle2 size={13} />
            You've already booked this property
          </div>
        )}
      </div>

      <div className="px-6 pb-6 space-y-4">
        {/* Date Pickers */}
        <div className="space-y-3 pt-2">
          <DatePicker
            label="Check-in"
            value={checkIn}
            onChange={setCheckIn}
            className="w-full"
            isRequired
            isDisabled={!!booked}
            classNames={{ inputWrapper: 'bg-gray-50 border border-gray-200' }}
          />
          <DatePicker
            label="Check-out"
            value={checkOut}
            onChange={setCheckOut}
            className="w-full"
            isRequired
            isDisabled={!!booked}
            classNames={{ inputWrapper: 'bg-gray-50 border border-gray-200' }}
          />
          <Input
            label="Guests"
            type="number"
            min={1}
            max={listing.guests || 10}
            value={guests.toString()}
            isRequired
            isDisabled={!!booked}
            onChange={(e) => setGuests(parseInt(e.target.value) || 1)}
            startContent={<Users size={15} className="text-gray-400" />}
            classNames={{ inputWrapper: 'bg-gray-50 border border-gray-200' }}
          />
        </div>

        {/* Price Breakdown */}
        {nights > 0 && (
          <>
            <Divider />
            <div className="space-y-2.5">
              <div className="flex justify-between text-sm text-gray-600">
                <span>D{listing.price} × {nights} night{nights !== 1 ? 's' : ''}</span>
                <span className="font-medium text-gray-800">D{subtotal}</span>
              </div>
              {cleaningFee > 0 && (
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Cleaning fee</span>
                  <span className="font-medium text-gray-800">D{cleaningFee}</span>
                </div>
              )}
              {serviceFee > 0 && (
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Service fee</span>
                  <span className="font-medium text-gray-800">D{serviceFee}</span>
                </div>
              )}
              <Divider />
              <div className="flex justify-between font-bold text-gray-900">
                <span>Total</span>
                <span className="text-indigo-600">D{total}</span>
              </div>
            </div>
          </>
        )}

        {/* CTA */}
        {booked ? (
          <div
            className="w-full py-3 rounded-xl text-center text-sm font-semibold"
            style={{ background: 'rgba(16,185,129,0.08)', color: '#10b981', border: '1px solid rgba(16,185,129,0.2)' }}
          >
            ✓ Booking Request Sent
          </div>
        ) : session?.user ? (
          <Button
            onPress={handleBook}
            isLoading={loading}
            isDisabled={!canBook}
            fullWidth
            className="font-bold h-12 rounded-xl text-base"
            style={{
              background: canBook
                ? 'linear-gradient(135deg, #6366f1, #8b5cf6)'
                : undefined,
              color: canBook ? '#fff' : undefined,
              boxShadow: canBook ? '0 4px 20px rgba(99,102,241,0.35)' : undefined,
            }}
          >
            {nights > 0 ? `Reserve · D${total}` : 'Select dates to reserve'}
          </Button>
        ) : (
          <div className="space-y-3">
            <p className="text-center text-sm text-gray-500">Sign in to book this property</p>
            <Link href="/login">
              <Button
                fullWidth
                className="font-bold h-11 rounded-xl"
                style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', color: '#fff' }}
              >
                Sign In to Book
              </Button>
            </Link>
          </div>
        )}

        {/* Trust badge */}
        <div className="flex items-center justify-center gap-2 text-xs text-gray-400 pt-1">
          <Shield size={12} />
          <span>You won't be charged yet</span>
        </div>
      </div>
    </div>
  )
}

export default ReservationCard