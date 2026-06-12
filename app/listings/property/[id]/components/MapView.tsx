"use client"
import React from 'react'
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet'
import "leaflet/dist/leaflet.css";
import MapComponent from '@/app/listings/components/MapComponent';

const MapView = ({listingLat,listingLon,name}:{listingLat:number,listingLon:number,name:string}) => {
    return (

        <div className="rounded-lg overflow-hidden h-96"> {/* Increased height for better map visibility */}
            <MapComponent
            latitude={listingLat}
            longitude={listingLon}
            propertyName={name}
            />
        </div>
    )
}

export default MapView