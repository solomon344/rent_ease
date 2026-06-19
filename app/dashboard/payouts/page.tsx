'use client'

import React, { useState } from 'react'
import { useSession } from 'next-auth/react'
import Api from '@/lib/api'
import { Button } from '@heroui/button'
import { Input } from '@heroui/input'
import { Select, SelectItem } from '@heroui/select'
import { Card, CardBody } from '@heroui/card'
import { addToast } from '@heroui/toast'
import { isAxiosError } from 'axios'
import {
  ArrowLeft,
  DollarSign,
  Phone,
  Calendar,
  CheckCircle,
  AlertCircle,
  Info,
  RefreshCw,
  Clock,
} from 'lucide-react'
import Link from 'next/link'
import type { CustomSession } from '@/types'

const paymentMethods = [
  { id: 'wave', name: 'Wave', icon: '💙' },
  { id: 'afrimoney', name: 'Afrimoney', icon: '💰' },
]

export default function PayoutsPage() {
  const { data: session }:{ data: CustomSession | null } = useSession()
  const [amount, setAmount] = useState('')
  const [mobileMoneyNumber, setMobileMoneyNumber] = useState('')
  const [paymentMethod, setPaymentMethod] = useState<string>('wave')
  const [loading, setLoading] = useState(false)
  const [lastPayout, setLastPayout] = useState<{ amount: number; date: string } | null>(null)
  const [nextPayoutDate, setNextPayoutDate] = useState<string | null>(null)

  React.useEffect(() => {
    if (session?.user?.djangoAccess) {
      // Fetch last payout and next payout date
      Api.get('/payouts/last/', { headers: { Authorization: `Token ${session.user.djangoAccess}` } })
        .then(res => {
          if (res.data) {
            setLastPayout(res.data)
            // Calculate next payout date (24 hours from last payout)
            if (res.data.date) {
              const lastDate = new Date(res.data.date)
              const nextDate = new Date(lastDate.getTime() + 24 * 60 * 60 * 1000)
              setNextPayoutDate(nextDate.toISOString())
            }
          }
        })
        .catch(() => {})
    }
  }, [session?.user?.djangoAccess])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!session?.user?.djangoAccess) return

    if (!amount || parseFloat(amount) <= 0) {
      addToast({ title: 'Invalid Amount', color: 'danger', description: 'Please enter a valid amount' })
      return
    }

    if (!mobileMoneyNumber) {
      addToast({ title: 'Mobile Money Number Required', color: 'danger', description: 'Please enter your mobile money number' })
      return
    }

    setLoading(true)

    try {
      const response = await Api.post('/payouts/create/', {
        amount: parseFloat(amount),
        mobile_money_number: mobileMoneyNumber,
        payment_method: paymentMethod,
      }, {
        headers: { Authorization: `Token ${session.user.djangoAccess}` }
      })

      if (response.data.success) {
        addToast({ title: 'Payout Initiated', color: 'success', description: 'Your payout request has been submitted successfully.' })
        setAmount('')
        setMobileMoneyNumber('')
        // Refresh last payout data
        Api.get('/payouts/last/', { headers: { Authorization: `Token ${session.user.djangoAccess}` } })
          .then(res => {
            if (res.data) {
              setLastPayout(res.data)
              // Calculate next payout date (24 hours from now)
              const nextDate = new Date(Date.now() + 24 * 60 * 60 * 1000)
              setNextPayoutDate(nextDate.toISOString())
            }
          })
      } else {
        addToast({ title: 'Payout Failed', color: 'danger', description: response.data.message || 'Failed to initiate payout' })
      }
    } catch (e) {
      if (isAxiosError(e)) {
        addToast({ title: 'Payout Error', color: 'danger', description: e.response?.data?.message || 'Failed to process payout request' })
      } else {
        addToast({ title: 'Error', color: 'danger', description: 'An unexpected error occurred' })
      }
    } finally {
      setLoading(false)
    }
  }

  const canRequestPayout = !nextPayoutDate || new Date(nextPayoutDate) <= new Date()

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/dashboard">
            <Button
              variant="flat"
              startContent={<ArrowLeft size={16} />}
              className="font-medium"
            >
              Back to Dashboard
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <Card className="shadow-lg rounded-2xl border-none">
              <CardBody className="p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: 'rgba(16,185,129,0.1)' }}>
                    <DollarSign size={20} style={{ color: '#10b981' }} />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">Request Payout</h1>
                    <p className="text-gray-500">Withdraw funds from your RentEase account</p>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input
                      label="Amount (D)"
                      type="number"
                      placeholder="1000"
                      value={amount}
                      onValueChange={setAmount}
                      isRequired
                      startContent={<span className="text-gray-400">D</span>}
                      classNames={{ label: 'font-medium text-gray-700' }}
                    />

                    <Input
                      label="Mobile Money Number"
                      type="tel"
                      placeholder="220 000 000"
                      value={mobileMoneyNumber}
                      onValueChange={setMobileMoneyNumber}
                      isRequired
                      startContent={<Phone size={16} className="text-gray-400" />}
                      classNames={{ label: 'font-medium text-gray-700' }}
                    />
                  </div>

                  <Select
                    label="Payment Method"
                    selectedKeys={[paymentMethod]}
                    onSelectionChange={(keys: any) => setPaymentMethod(Array.from(keys)[0] as string)}
                    classNames={{ label: 'font-medium text-gray-700' }}
                  >
                    {paymentMethods.map(method => (
                      <SelectItem key={method.id} textValue={method.name}>
                        <div className="flex items-center gap-2">
                          <span>{method.icon}</span>
                          <span>{method.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </Select>

                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Info size={14} />
                    <p>Payouts are processed within 24 hours of request</p>
                  </div>

                  <Button
                    type="submit"
                    isLoading={loading}
                    disabled={!canRequestPayout}
                    className="w-full font-semibold py-3"
                    style={{
                      background: canRequestPayout
                        ? 'linear-gradient(135deg, #10b981, #059669)'
                        : 'rgba(16,185,129,0.2)',
                      color: canRequestPayout ? '#fff' : '#10b981',
                      boxShadow: canRequestPayout ? '0 4px 12px rgba(16,185,129,0.3)' : 'none'
                    }}
                    startContent={<DollarSign size={18} />}
                  >
                    {canRequestPayout ? 'Request Payout' : 'Payout Available Soon'}
                  </Button>

                  {!canRequestPayout && nextPayoutDate && (
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Clock size={14} />
                      <p>Next available payout: {new Date(nextPayoutDate).toLocaleString()}</p>
                    </div>
                  )}
                </form>
              </CardBody>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card className="shadow-lg rounded-2xl border-none">
              <CardBody className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: 'rgba(16,185,129,0.1)' }}>
                    <CheckCircle size={18} style={{ color: '#10b981' }} />
                  </div>
                  <h2 className="text-lg font-semibold text-gray-900">Last Payout</h2>
                </div>

                {lastPayout ? (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500">Amount</span>
                      <span className="font-medium text-gray-900">D{lastPayout?.amount?.toFixed(2)??0.00}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500">Date</span>
                      <span className="font-medium text-gray-900">{new Date(lastPayout.date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500">Status</span>
                      <span className="flex items-center gap-1 text-green-600">
                        <CheckCircle size={14} />
                        <span className="font-medium">Completed</span>
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-2">
                      <DollarSign size={18} className="text-gray-400" />
                    </div>
                    <p className="text-gray-500">No payouts yet</p>
                  </div>
                )}
              </CardBody>
            </Card>

            <Card className="shadow-lg rounded-2xl border-none">
              <CardBody className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: 'rgba(245,158,11,0.1)' }}>
                    <Calendar size={18} style={{ color: '#f59e0b' }} />
                  </div>
                  <h2 className="text-lg font-semibold text-gray-900">Payout Policy</h2>
                </div>

                <div className="space-y-4 text-sm">
                  <div className="flex items-start gap-2">
                    <CheckCircle size={16} className="text-green-500 mt-0.5 flex-shrink-0" />
                    <p className="text-gray-600">Payouts are processed within 24 hours of request</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle size={16} className="text-green-500 mt-0.5 flex-shrink-0" />
                    <p className="text-gray-600">Minimum payout amount: D100</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle size={16} className="text-green-500 mt-0.5 flex-shrink-0" />
                    <p className="text-gray-600">Available payment methods: Wave, Afrimoney</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <AlertCircle size={16} className="text-yellow-500 mt-0.5 flex-shrink-0" />
                    <p className="text-gray-600">Payouts are subject to processing fees</p>
                  </div>
                </div>
              </CardBody>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}