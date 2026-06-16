'use client'

import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Api from '@/lib/api'
import Link from 'next/link'
import { CheckCircle2, XCircle, ArrowRight, Loader2 } from 'lucide-react'

const PaymentVerifyPage = () => {
  const searchParams = useSearchParams()
  const bookingId = searchParams.get('booking_id')
  const paymentIntentId = searchParams.get('payment_intent_id')
  const [status, setStatus] = useState<'loading' | 'paid' | 'pending' | 'failed' | 'error'>('loading')
  const [message, setMessage] = useState<string>('Verifying payment...')
  const [paymentLink, setPaymentLink] = useState<string | null>(null)

  useEffect(() => {
    const verify = async () => {
      if (!bookingId) {
        setStatus('error')
        setMessage('Missing booking ID in the URL.')
        return
      }

      try {
        const response = await Api.post(
          `/booking/payment/callback/`,
          { booking_id: bookingId, transaction_id: paymentIntentId }
        )
        const data = response.data
        setPaymentLink(data.payment_link || null)

        if (data.paid) {
          setStatus('paid')
          setMessage('Payment verified! Your booking is confirmed and ready.')
        } else if (data.payment_state === 'requires_payment') {
          setStatus('pending')
          setMessage('Payment is still pending. Complete checkout using the link below.')
        } else if (data.payment_state === 'failed') {
          setStatus('failed')
          setMessage('Payment failed. Please try again or contact support.')
        } else {
          setStatus('pending')
          setMessage('Booking found. Complete payment to finalize your reservation.')
        }
      } catch (error) {
        console.error('Payment verification failed', error)
        setStatus('error')
        setMessage('Unable to verify payment at the moment.')
      }
    }

    verify()
  }, [bookingId, paymentIntentId])

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-6">
      <div className="w-full max-w-2xl rounded-3xl border border-slate-200 bg-white p-8 shadow-xl">
        <div className="flex items-center gap-4 mb-6">
          {status === 'loading' ? (
            <Loader2 className="h-10 w-10 animate-spin text-indigo-500" />
          ) : status === 'paid' ? (
            <CheckCircle2 className="h-10 w-10 text-emerald-500" />
          ) : (
            <XCircle className="h-10 w-10 text-rose-500" />
          )}
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">Payment Verification</h1>
            <p className="text-sm text-slate-500">{message}</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-3xl bg-slate-50 p-4">
            <p className="text-sm text-slate-500">Booking ID</p>
            <p className="text-base font-semibold text-slate-900">{bookingId}</p>
          </div>

          {status === 'pending' && paymentLink && (
            <a href={paymentLink} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-2 rounded-2xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700">
              Continue to Checkout <ArrowRight size={16} />
            </a>
          )}

          {status === 'paid' && (
            <Link href="/bookings" className="inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700">
              View My Bookings
            </Link>
          )}

          {(status === 'failed' || status === 'error') && (
            <div className="rounded-3xl bg-rose-50 p-4 text-sm text-rose-700">
              If you continue to have trouble, contact support at <a href="mailto:support@rentease.com" className="underline">support@rentease.com</a>.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default PaymentVerifyPage
