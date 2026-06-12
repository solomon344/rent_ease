'use client'
import { Image } from '@heroui/image'
import { BreadcrumbItem, Breadcrumbs } from '@heroui/react'
import { Button } from '@heroui/button'
import { Share2, Heart, Play } from 'lucide-react'
import { useState } from 'react'
interface MediaSlot {
  url: string
  type: 'image' | 'video'
}

const Banner = ({ listing }: { listing: any }) => {
  const [wishlisted, setWishlisted] = useState(false)
  const [activeIdx, setActiveIdx] = useState(0)

  // Build unified media array: cover image first, then additional media
  const allMedia: MediaSlot[] = [
    { url: listing?.image, type: 'image' },
    ...(listing?.media || [])
      .slice(0, 4)
      .map((m: any) => ({ url: m.url, type: m.type as 'image' | 'video' })),
  ]

  const active = allMedia[activeIdx]

  return (
    <div className="w-full flex flex-col gap-4 mb-8">
      <Breadcrumbs
        classNames={{ list: 'text-sm' }}
        itemClasses={{ item: 'text-gray-500 hover:text-indigo-600', separator: 'text-gray-300' }}
      >
        <BreadcrumbItem href="/">Home</BreadcrumbItem>
        <BreadcrumbItem href="/listings">Properties</BreadcrumbItem>
        <BreadcrumbItem href={`/listings/property/${listing?.id}`} className="text-gray-800 font-medium">
          {listing?.name}
        </BreadcrumbItem>
      </Breadcrumbs>

      <div className="relative grid grid-cols-4 grid-rows-2 gap-2 h-[420px] rounded-2xl overflow-hidden">
        {/* Main slot — left half */}
        <div className="col-span-2 row-span-2 relative overflow-hidden bg-gray-100">
          {active?.type === 'video' ? (
            <video
              key={active.url}
              src={active.url}
              controls
              className="w-full h-full object-cover"
            />
          ) : (
            <Image
              src={active?.url}
              fallbackSrc="https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800"
              alt={listing?.name}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
              removeWrapper
            />
          )}
        </div>

        {/* Secondary slots — right half */}
        {allMedia.slice(1, 5).map((slot, i) => (
          <div
            key={i}
            className="relative overflow-hidden bg-gray-100 cursor-pointer"
            onClick={() => setActiveIdx(i + 1)}
          >
            {slot.type === 'video' ? (
              <>
                <video
                  src={slot.url}
                  muted
                  preload="metadata"
                  className="w-full h-full object-cover hover:brightness-90 transition-all duration-500"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/20 hover:bg-black/30 transition-colors">
                  <div className="w-9 h-9 rounded-full bg-white/80 backdrop-blur flex items-center justify-center">
                    <Play size={16} className="text-gray-800 ml-0.5" />
                  </div>
                </div>
              </>
            ) : (
              <Image
                src={slot.url}
                fallbackSrc="https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400"
                alt={`Photo ${i + 2}`}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500 hover:brightness-90"
                removeWrapper
              />
            )}
          </div>
        ))}

        {/* Gradient on main image (only when showing image) */}
        {active?.type !== 'video' && (
          <div className="absolute inset-y-0 left-0 w-1/2 bg-gradient-to-t from-black/30 to-transparent pointer-events-none" />
        )}

        {/* Action buttons */}
        <div className="absolute top-4 right-4 flex items-center gap-2">
          <Button
            isIconOnly
            size="sm"
            onPress={() => setWishlisted(w => !w)}
            className="rounded-full"
            style={{ background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(8px)', boxShadow: '0 2px 12px rgba(0,0,0,0.12)' }}
          >
            <Heart size={16} className={wishlisted ? 'fill-red-500 text-red-500' : 'text-gray-700'} />
          </Button>
          <Button
            isIconOnly
            size="sm"
            className="rounded-full"
            style={{ background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(8px)', boxShadow: '0 2px 12px rgba(0,0,0,0.12)' }}
          >
            <Share2 size={16} className="text-gray-700" />
          </Button>
        </div>

        {/* Show all count */}
        {allMedia.length > 5 && (
          <button
            className="absolute bottom-4 right-4 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 hover:shadow-lg"
            style={{ background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(8px)', color: '#111827' }}
          >
            Show all {allMedia.length} media
          </button>
        )}
      </div>
    </div>
  )
}

export default Banner
