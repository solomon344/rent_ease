
import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default icon not showing
// delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

interface MapComponentProps {
  latitude: number|undefined;
  longitude: number|undefined;
  propertyName: string;
}

const MapComponent: React.FC<MapComponentProps> = ({ latitude, longitude, propertyName }) => {
  return (
    <MapContainer  center={[latitude||13.4493, longitude||-16.5799]} zoom={20} scrollWheelZoom={false} style={{ height: '400px', width: '100%' }}>
      <TileLayer
      
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={[latitude||13.4493, longitude||-16.5799]}>
        <Popup>{propertyName}</Popup>
      </Marker>
    </MapContainer>
  );
};

export default MapComponent;
