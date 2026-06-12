import React from 'react'
import Banner from './components/Banner'
import ReservationCard from './components/ReservationCard'
import { Amenity, DataLoader, amenities as amenityIcons } from '@/data/listings'
import {
  StarIcon,
  Users,
  BedDouble,
  Bath,
  MapPin,
  Award,
  Calendar,
  CheckCircle2,
  ChevronRight,
} from 'lucide-react'
import { Divider } from '@heroui/divider'
import { Badge } from '@heroui/badge'
import { Chip } from '@heroui/chip'
import { Avatar } from '@heroui/avatar'
import { auth } from '@/lib/auth'
import MapView from './components/MapView'
import Link from 'next/link'
import Footer from '@/components/footer'

const Page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params
  const session = await auth()
  const dataLoader = new DataLoader()
  // @ts-ignore
  const listing = await dataLoader.getListingById(id, session?.user?.access)

  if (!listing) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#f8fafc' }}>
        <div className="text-center">
          <div className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ background: 'rgba(99,102,241,0.08)' }}>
            <MapPin size={36} style={{ color: '#6366f1' }} />
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Property Not Found</h2>
          <p className="text-gray-500 mb-4">This listing may have been removed or is unavailable.</p>
          <Link href="/listings" className="text-indigo-600 font-semibold hover:underline">
            ← Back to listings
          </Link>
        </div>
      </div>
    )
  }

  const listingLat = listing.latitude || 0
  const listingLon = listing.longitude || 0

  const statsItems = [
    { icon: Users, label: `${listing.guests || 1} guest${(listing.guests || 1) !== 1 ? 's' : ''}` },
    // @ts-ignore
    { icon: BedDouble, label: `${listing.beds || listing.bedrooms || 1} bedroom${(listing.beds || listing.bedrooms || 1) !== 1 ? 's' : ''}` },
    { icon: Bath, label: `${listing.baths || 1} bath${(listing.baths || 1) !== 1 ? 's' : ''}` },
  ]

  return (
    <div className="min-h-screen" style={{ background: '#f8fafc' }}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {/* Banner (image gallery) */}
        <Banner listing={listing} />

        {/* Title row */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-6">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 mb-2 leading-tight">{listing.name}</h1>
            <div className="flex flex-wrap items-center gap-3">
              {listing.rating && (
                <div className="flex items-center gap-1.5">
                  <StarIcon size={15} fill="#f59e0b" className="text-amber-400" />
                  <span className="font-bold text-gray-800">{listing.rating}</span>
                  <span className="text-gray-500 text-sm">({listing.reviewCount || 0} reviews)</span>
                </div>
              )}
              <span className="text-gray-300">·</span>
              <div className="flex items-center gap-1.5">
                <MapPin size={14} className="text-gray-400" />
                <span className="text-gray-600 text-sm capitalize">{listing.location}</span>
              </div>
              {listing.isSuperhost && (
                <Chip
                  size="sm"
                  startContent={<Award size={12} />}
                  style={{ background: 'rgba(99,102,241,0.1)', color: '#6366f1' }}
                  className="font-semibold text-xs"
                >
                  Superhost
                </Chip>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Host info */}
            <div
              className="flex items-center gap-4 p-5 rounded-2xl"
              style={{ background: '#fff', border: '1px solid #e2e8f0', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}
            >
              <Avatar
                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${listing.owner?.user?.first_name}`}
                size="lg"
                className="ring-2 ring-indigo-100"
              />
              <div className="flex-1">
                <p className="font-bold text-gray-900">
                  Hosted by {listing.owner?.user?.first_name || 'Anonymous'} {listing.owner?.user?.last_name || ''}
                </p>
                <div className="flex items-center gap-3 mt-1">
                  {listing.hostExperience && (
                    <span className="text-sm text-gray-500">{listing.hostExperience} years hosting</span>
                  )}
                  {listing.isSuperhost && (
                    <span className="flex items-center gap-1 text-xs font-medium text-indigo-600">
                      <Award size={12} /> Superhost
                    </span>
                  )}
                </div>
              </div>
              <ChevronRight size={18} className="text-gray-300" />
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
              {statsItems.map((stat, i) => (
                <div
                  key={i}
                  className="flex flex-col items-center gap-2 p-4 rounded-2xl text-center"
                  style={{ background: '#fff', border: '1px solid #e2e8f0', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}
                >
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(99,102,241,0.08)' }}>
                    <stat.icon size={18} style={{ color: '#6366f1' }} />
                  </div>
                  <span className="text-sm font-semibold text-gray-700">{stat.label}</span>
                </div>
              ))}
            </div>

            {/* Description */}
            <div
              className="p-6 rounded-2xl"
              style={{ background: '#fff', border: '1px solid #e2e8f0', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}
            >
              <h2 className="text-xl font-bold text-gray-900 mb-3">About this place</h2>
              <p className="text-gray-600 leading-relaxed">{listing.description}</p>
              {listing.bookings && (
                <div className="flex items-center gap-1.5 mt-4 text-sm text-gray-500">
                  <Calendar size={14} />
                  <span>{listing.bookings.length} booking{listing.bookings.length !== 1 ? 's' : ''}</span>
                </div>
              )}
            </div>

            {/* Amenities */}
            <div
              className="p-6 rounded-2xl"
              style={{ background: '#fff', border: '1px solid #e2e8f0', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}
            >
              <h2 className="text-xl font-bold text-gray-900 mb-4">What this place offers</h2>
              <div className="grid grid-cols-2 gap-3">
                {listing?.amenities?.map((amenity: { name: string }, index: number) => {
                  const icon = amenityIcons[amenity.name.toLowerCase()]
                  return (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-3 rounded-xl transition-colors hover:bg-indigo-50"
                      style={{ background: 'rgba(248,250,252,1)' }}
                    >
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(99,102,241,0.1)', color: '#6366f1' }}>
                        {icon?.icon}
                      </div>
                      <span className="text-sm font-medium text-gray-700">{amenity.name}</span>
                      <CheckCircle2 size={14} className="ml-auto text-emerald-400 flex-shrink-0" />
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Map */}
            <div
              className="p-6 rounded-2xl"
              style={{ background: '#fff', border: '1px solid #e2e8f0', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}
            >
              <h2 className="text-xl font-bold text-gray-900 mb-2">Where you'll be</h2>
              <div className="flex items-center gap-2 mb-4">
                <MapPin size={14} className="text-indigo-500" />
                <span className="text-sm text-gray-600 capitalize">{listing.location}, The Gambia</span>
              </div>
              <div className="rounded-xl overflow-hidden">
                <MapView name={listing.name} listingLat={listingLat} listingLon={listingLon} />
              </div>
            </div>
          </div>

          {/* Booking Sidebar */}
          <div className="lg:col-span-1">
            <ReservationCard listing={listing} />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default Page
