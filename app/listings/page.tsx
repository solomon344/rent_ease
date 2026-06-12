import React from 'react'
import { DataLoader } from '@/data/listings'
import ListingsClient from './components/ListingsClient'
import { auth } from '@/lib/auth'
import Footer from '@/components/footer'

const Page = async () => {
  const session = await auth()
  const dataLoader = new DataLoader()

  // @ts-ignore
  const listings = await dataLoader.getListings(session?.user?.access, {})
  // @ts-ignore
  const amenities = await dataLoader.getAmenities(session?.user?.access)

  const defaultLatitude = listings.length > 0 ? listings[0].latitude : 0
  const defaultLongitude = listings.length > 0 ? listings[0].longitude : 0

  return (
    <div>
      <ListingsClient
        initialListings={listings}
        amenities={amenities}
        // @ts-ignore
        accessToken={session?.user?.access}
        latitude={defaultLatitude}
        longitude={defaultLongitude}
      />
      <Footer />
    </div>
  )
}

export default Page