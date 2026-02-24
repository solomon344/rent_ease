import React from 'react'
import CreateProperty from '../../create/components/CrateProperty'
import { DataLoader } from '@/data/listings'
import { auth } from '@/lib/auth'
import UpdateProperty from '../../create/components/UpdateProduct'

const page = async({params}: {params: Promise<{id: string}>}) => {
  const session = await auth()
  const {id} = await params
  const dataLoader = new DataLoader();
  
  console.log("session from create property", session)
  // @ts-ignore
  const amenities = await dataLoader.getAmenities(session?.user?.access)
  // @ts-ignore
  const property = await dataLoader.getListingById(id,session?.user?.access)
  console.log(amenities)
  return (
    <div>
      <UpdateProperty property={property} amenities={amenities}/>
    </div>
  )
}

export default page