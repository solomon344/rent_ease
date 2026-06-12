'use client'
import React, { useState } from 'react'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import Api from '@/lib/api'
import { addToast } from '@heroui/toast'
import { isAxiosError } from 'axios'
import type { CustomSession } from '@/types'
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  Eye,
  Building2,
  MapPin,
  Star,
  Users,
  DollarSign,
  Filter,
  MoreVertical,
  Bed,
  BathIcon,
} from 'lucide-react'
import { Button } from '@heroui/button'
import { Input } from '@heroui/input'
import { Image } from '@heroui/image'
import { Chip } from '@heroui/chip'

export default function PropertiesPage() {
  const { data: session }:{ data: CustomSession | null} = useSession()
  const [listings, setListings] = React.useState<any[]>([])
  const [searchTerm, setSearchTerm] = React.useState('')
  const [signal, setSignal] = useState(false)
  const [loading, setLoading] = useState(true)

  React.useEffect(() => {
    // @ts-ignore
    if (session?.user?.djangoAccess){
      setLoading(true)
    Api.get(
      // @ts-ignore
      `/properties/?owner__user__email=${session.user.email}`,
      // @ts-ignore
      { headers: { Authorization: `Token ${session?.user?.djangoAccess}` } }
    ).then(res => {
      setListings(res.data)
      setLoading(false)
    }).catch(() => setLoading(false))
    }
    
  }, [session?.user?.djangoAccess])

  const filtered = listings.filter((l: any) =>
    l.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    l.location?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleDelete = async (id: string) => {
    try {
      // @ts-ignore
      await Api.delete(`/properties/${id}/`, { headers: { Authorization: `Token ${session?.user?.djangoAccess}` } })
      addToast({ title: 'Deleted', color: 'success', description: 'Property removed successfully.' })
      setSignal(p => !p)
    } catch (e) {
      if (isAxiosError(e)) {
        addToast({ 
          title: 'Error', 
          color: 'danger', 
          description: e.response?.data?.message || 'Failed to delete property.' 
        })
      } else {
        addToast({ title: 'Error', color: 'danger', description: 'Failed to delete property.' })
      }
    }
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold uppercase tracking-widest px-2 py-1 rounded-full" style={{ background: 'rgba(16,185,129,0.1)', color: '#10b981' }}>
              Properties
            </span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">My Properties</h1>
          <p className="text-gray-500 mt-1">{listings.length} total listing{listings.length !== 1 ? 's' : ''}</p>
        </div>
        <Link href="/dashboard/create">
          <Button
            startContent={<Plus size={18} />}
            className="font-semibold"
            style={{
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              color: '#fff',
              boxShadow: '0 4px 15px rgba(99,102,241,0.35)',
            }}
          >
            Add Property
          </Button>
        </Link>
      </div>

      {/* Search & Filters */}
      <div className="flex gap-3 mb-6">
        <div className="flex-1 max-w-md">
          <Input
            placeholder="Search by name or location..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            startContent={<Search size={18} className="text-gray-400" />}
            classNames={{
              inputWrapper: 'bg-white border border-gray-200 shadow-sm',
            }}
          />
        </div>
        <Button
          variant="bordered"
          startContent={<Filter size={16} />}
          className="border-gray-200 bg-white text-gray-600"
        >
          Filter
        </Button>
      </div>

      {/* Loading state */}
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {[1, 2, 3].map(i => (
            <div key={i} className="rounded-2xl bg-white overflow-hidden animate-pulse" style={{ border: '1px solid #e2e8f0', boxShadow: '0 4px 20px rgba(0,0,0,0.04)' }}>
              <div className="h-44 bg-gray-100" />
              <div className="p-5 space-y-3">
                <div className="h-4 bg-gray-100 rounded w-3/4" />
                <div className="h-3 bg-gray-100 rounded w-1/2" />
                <div className="h-3 bg-gray-100 rounded w-1/3" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty state */}
      {!loading && filtered.length === 0 && (
        <div className="text-center py-20">
          <div className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ background: 'rgba(99,102,241,0.08)' }}>
            <Building2 size={36} style={{ color: '#6366f1' }} />
          </div>
          <h3 className="text-lg font-bold text-gray-800 mb-2">No properties found</h3>
          <p className="text-gray-400 mb-6">{searchTerm ? 'Try a different search term' : 'Start by adding your first property.'}</p>
          {!searchTerm && (
            <Link href="/dashboard/create">
              <Button style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', color: '#fff' }} startContent={<Plus size={18} />}>
                Add First Property
              </Button>
            </Link>
          )}
        </div>
      )}

      {/* Properties Cards Grid */}
      {!loading && filtered.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filtered.map((listing: any) => (
            <div
              key={listing.id}
              className="rounded-2xl bg-white overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl group"
              style={{ border: '1px solid #e2e8f0', boxShadow: '0 4px 20px rgba(0,0,0,0.04)' }}
            >
              {/* Property Image */}
              <div className="relative h-44 overflow-hidden bg-gray-100">
                <Image
                  src={listing.image}
                  alt={listing.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  removeWrapper
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                <div className="absolute bottom-3 left-3 z-10 px-3 py-1 rounded-xl font-bold text-white text-sm backdrop-blur-sm "
                style={{ background: 'rgba(99,102,241,0.85)', boxShadow: '0 2px 10px rgba(99,102,241,0.4)' }}
                >
                  <span className="text-white ">${listing.price}<span className="text-sm font-normal opacity-80">/night</span></span>
                </div>
                <div className="absolute top-3 right-3">
                  <Chip size="sm" className="bg-white/90 text-green-700 font-semibold text-xs">Active</Chip>
                </div>
              </div>

              {/* Property Info */}
              <div className="p-5">
                <h3 className="font-bold text-gray-900 text-base mb-1 truncate">{listing.name}</h3>

                <div className="flex items-center gap-1.5 mb-3">
                  <MapPin size={13} className="text-gray-400 flex-shrink-0" />
                  <span className="text-sm text-gray-500 truncate capitalize">{listing.location}</span>
                </div>

                <div className="flex items-center gap-4 mb-4">
                  {listing.rating && (
                    <div className="flex items-center gap-1">
                      <Star size={13} className="text-amber-400" fill="#fbbf24" />
                      <span className="text-sm font-semibold text-gray-700">{listing.rating}</span>
                      {listing.reviewCount && <span className="text-xs text-gray-400">({listing.reviewCount})</span>}
                    </div>
                  )}
                  {listing.guests && (
                    <div className="flex items-center gap-1">
                      <Users size={13} className="text-gray-400" />
                      <span className="text-sm text-gray-500">{listing.guests} guests</span>
                    </div>
                  )}
                  {listing.beds && (
                    <div className="flex items-center gap-1">
                      <Bed size={13} className="text-gray-400" />
                      <span className="text-sm text-gray-500">{listing.beds} beds</span>
                    </div>
                  )}
                  {listing.baths && (
                    <div className="flex items-center gap-1">
                      <BathIcon size={13} className="text-gray-400" />
                      <span className="text-sm text-gray-500">{listing.baths} baths</span>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-3 border-t border-gray-100">
                  <Link href={`/listings/property/${listing.id}`} className="flex-1">
                    <Button
                      variant="bordered"
                      size="sm"
                      startContent={<Eye size={14} />}
                      className="w-full border-gray-200 text-gray-600 text-xs font-medium"
                    >
                      View
                    </Button>
                  </Link>
                  <Link href={`/dashboard/update/${listing.id}`} className="flex-1">
                    <Button
                      size="sm"
                      startContent={<Edit2 size={14} />}
                      className="w-full text-xs font-semibold"
                      style={{ background: 'rgba(99,102,241,0.1)', color: '#6366f1' }}
                    >
                      Edit
                    </Button>
                  </Link>
                  <Button
                    size="sm"
                    isIconOnly
                    onPress={() => handleDelete(listing.id)}
                    style={{ background: 'rgba(239,68,68,0.08)', color: '#ef4444' }}
                  >
                    <Trash2 size={14} />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
