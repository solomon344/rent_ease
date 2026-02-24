'use client'
import { type LocationCategory as LC} from "@/data/listings"
import {Image} from "@heroui/react"

const LocationCategory = ({id,name, imageUrl}: LC) => {
  return (
    <div className="flex flex-col gap-3">
        <Image src={imageUrl} alt={name} width={300} height={200} className="rounded-md object-cover"/>
        <p className="font-bold ">{name}</p>
    </div>
  )
}

export default LocationCategory