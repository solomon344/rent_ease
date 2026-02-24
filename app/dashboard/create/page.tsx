import React from 'react'
import CreateProperty from './components/CrateProperty'
import { DataLoader } from '@/data/listings'
import { auth } from '@/lib/auth'

const page = async() => {
  const session = await auth()
  const dataLoader = new DataLoader();
  
  console.log("session from create property", session)
  // @ts-ignore
  const amenities = await dataLoader.getAmenities(session?.user?.access)
  console.log(amenities)
  return (
    <div>
      <CreateProperty amenities={amenities}/>
    </div>
  )
}

export default page