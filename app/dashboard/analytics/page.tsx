'use client'

import React, { useEffect, useMemo, useState } from 'react'
import { useSession } from 'next-auth/react'
import type {CustomSession} from '@/types'
import Api from '@/lib/api'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  ArcElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import { Bar, Doughnut, Line } from 'react-chartjs-2'
import { ArrowUpRight, DollarSign as CurrencyDollar, LayoutGrid, Sparkles } from 'lucide-react'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  ArcElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
)

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'GMD',
  maximumFractionDigits: 0,
})

const formatCurrency = (value: number) => currencyFormatter.format(value)

function lastSixMonths() {
  const now = new Date()
  return Array.from({ length: 6 }).map((_, index) => {
    const date = new Date(now.getFullYear(), now.getMonth() - (5 - index), 1)
    return `${months[date.getMonth()]} ${date.getFullYear()}`
  })
}

function formatMonthKey(dateString: string) {
  const date = new Date(dateString)
  if (Number.isNaN(date.getTime())) {
    return ''
  }
  return `${months[date.getMonth()]} ${date.getFullYear()}`
}

const AnalyticsPage = () => {
  const { data: session }:{ data: CustomSession | null } = useSession()
  const [bookings, setBookings] = useState<any[]>([])
  const [propertyCount, setPropertyCount] = useState<number>(0)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
   if (session?.user?.djangoAccess){
     const fetchAnalytics = async () => {
      if (!session?.user?.djangoAccess || !session.user.email) {
        setIsLoading(false)
        return
      }

      try {
        const bookingResponse = await Api.get(
          `/booking/?property__owner__email=${encodeURIComponent(session.user.email)}`,
          {
            headers: {
              Authorization: `Token ${session.user.djangoAccess}`,
            },
          },
        )

        const propertyResponse = await Api.get(
          `/properties/?owner__user__email=${encodeURIComponent(session.user.email)}`,
          {
            headers: {
              Authorization: `Token ${session.user.djangoAccess}`,
            },
          },
        )

        setBookings(Array.isArray(bookingResponse.data) ? bookingResponse.data : [])
        setPropertyCount(Array.isArray(propertyResponse.data) ? propertyResponse.data.length : 0)
      } catch (error) {
        console.error('Unable to load analytics data', error)
        setBookings([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchAnalytics()
   }
  }, [session?.user?.djangoAccess])

  const summary = useMemo(() => {
    const statusCounts = bookings.reduce(
      (acc, booking) => {
        const status = booking.status || 'pending'
        acc[status] = (acc[status] || 0) + 1
        return acc
      },
      {
        pending: 0,
        confirmed: 0,
        cancelled: 0,
        rejected: 0,
      },
    )

    const totalRevenue = bookings
      .filter((booking) => booking.status === 'confirmed')
      .reduce(
        (sum, booking) => sum + Number(booking.total_price || 0),
        0,
      )

    return {
      totalBookings: bookings.length,
      confirmed: statusCounts.confirmed,
      cancelled: statusCounts.cancelled,
      pending: statusCounts.pending,
      statusCounts,
      totalRevenue,
    }
  }, [bookings])

  const monthlyLabels = lastSixMonths()

  const monthlyData = useMemo(() => {
    const counts = monthlyLabels.map(() => 0)
    const revenues = monthlyLabels.map(() => 0)

    bookings.forEach((booking) => {
      const monthKey = formatMonthKey(booking.created_at || booking.start_date || '')
      const index = monthlyLabels.indexOf(monthKey)
      if (index >= 0) {
        counts[index] += 1
        if (booking.status === 'confirmed') {
          revenues[index] += Number(booking.total_price || 0)
        }
      }
    })

    return { counts, revenues }
  }, [bookings, monthlyLabels])

  const topProperties = useMemo(() => {
    const map: Record<string, { name: string; count: number; revenue: number }> = {}

    bookings.forEach((booking) => {
      const propertyName = booking.property?.name || 'Unknown Property'
      if (!map[propertyName]) {
        map[propertyName] = { name: propertyName, count: 0, revenue: 0 }
      }
      map[propertyName].count += 1
      if (booking.status === 'confirmed') {
        map[propertyName].revenue += Number(booking.total_price || 0)
      }
    })

    return Object.values(map)
      .sort((a, b) => b.count - a.count)
      .slice(0, 5)
  }, [bookings])

  const statusChartData = {
    labels: ['Pending', 'Confirmed', 'Cancelled', 'Rejected'],
    datasets: [
      {
        label: 'Bookings',
        data: [
          summary.pending,
          summary.confirmed,
          summary.cancelled,
          summary.statusCounts.rejected,
        ],
        backgroundColor: ['#f59e0b', '#22c55e', '#ef4444', '#64748b'],
        borderWidth: 0,
      },
    ],
  }

  const bookingsChartData = {
    labels: monthlyLabels,
    datasets: [
      {
        label: 'Bookings',
        data: monthlyData.counts,
        borderColor: '#2563eb',
        backgroundColor: 'rgba(37, 99, 235, 0.2)',
        tension: 0.35,
        fill: true,
        pointRadius: 4,
      },
    ],
  }

  const revenueChartData = {
    labels: monthlyLabels,
    datasets: [
      {
        label: 'Revenue',
        data: monthlyData.revenues,
        backgroundColor: '#10b981',
        borderColor: '#10b981',
      },
    ],
  }

  return (
    <div className="space-y-6 px-4 py-6 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">Dashboard</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">Analytics</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
            Review bookings, revenue, and property performance across your dashboard.
          </p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-slate-500">Total bookings</p>
          <p className="mt-4 text-3xl font-semibold text-slate-900">{summary.totalBookings}</p>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-slate-500">Confirmed</p>
          <p className="mt-4 text-3xl font-semibold text-slate-900">{summary.confirmed}</p>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-slate-500">Pending</p>
          <p className="mt-4 text-3xl font-semibold text-slate-900">{summary.pending}</p>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-slate-500">Revenue</p>
          <p className="mt-4 text-3xl font-semibold text-slate-900">{formatCurrency(summary.totalRevenue)}</p>
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        <div className="col-span-2 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-slate-500">Bookings trend</p>
              <h2 className="text-xl font-semibold text-slate-900">Bookings last 6 months</h2>
            </div>
            <ArrowUpRight className="h-5 w-5 text-slate-400" />
          </div>
          <div className="mt-6 h-[320px]">
            <Line data={bookingsChartData} options={{ responsive: true, plugins: { legend: { display: false } } }} />
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-slate-500">Status distribution</p>
              <h2 className="text-xl font-semibold text-slate-900">Booking statuses</h2>
            </div>
            <Sparkles className="h-5 w-5 text-slate-400" />
          </div>
          <div className="mt-6 h-[320px]">
            <Doughnut data={statusChartData} options={{ responsive: true, plugins: { legend: { position: 'bottom' } } }} />
          </div>
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-slate-500">Revenue</p>
              <h2 className="text-xl font-semibold text-slate-900">Monthly revenue</h2>
            </div>
            <CurrencyDollar className="h-5 w-5 text-slate-400" />
          </div>
          <div className="mt-6 h-[320px]">
            <Bar data={revenueChartData} options={{ responsive: true, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true } } }} />
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-slate-500">Top listings</p>
              <h2 className="text-xl font-semibold text-slate-900">Most booked properties</h2>
            </div>
            <LayoutGrid className="h-5 w-5 text-slate-400" />
          </div>
          <div className="mt-6 space-y-4">
            {topProperties.length === 0 ? (
              <p className="text-sm text-slate-500">No booking activity available yet.</p>
            ) : (
              topProperties.map((property) => (
                <div key={property.name} className="rounded-3xl border border-slate-100 bg-slate-50 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="font-semibold text-slate-900">{property.name}</p>
                      <p className="text-sm text-slate-500">{property.count} bookings</p>
                    </div>
                    <p className="text-sm font-semibold text-slate-900">{formatCurrency(property.revenue)}</p>
                  </div>
                </div>
              ))
            )}
          </div>
          <div className="mt-6 rounded-3xl border border-slate-200 bg-white p-4 text-sm text-slate-500">
            <p>Properties managed: <span className="font-semibold text-slate-900">{propertyCount}</span></p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AnalyticsPage
