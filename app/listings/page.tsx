import React from 'react'
import { DataLoader } from '@/data/listings'
import ListingsClient from './components/ListingsClient'
import { auth } from '@/lib/auth'

const Page = async () => {
  const session = await auth()
  const dataLoader = new DataLoader()

  // @ts-ignore
  const listings = await dataLoader.getListings(session?.user?.access, {})
  // @ts-ignore
  const amenities = await dataLoader.getAmenities(session?.user?.access)

  return (
    <ListingsClient
      initialListings={listings}
      amenities={amenities}
      // @ts-ignore
      accessToken={session?.user?.access}
    />
  )
}

export default Page