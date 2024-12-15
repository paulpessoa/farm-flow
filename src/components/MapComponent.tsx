import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Farm } from '../types';
interface MapComponentProps {
    farm: Farm;
}

export const MapComponent: React.FC<MapComponentProps> = ({ farm }) => {
    if (!farm?.address) return <>Error loading map</>
    return (
        <MapContainer
            center={[farm.address.latitude, farm.address.longitude]}
            zoom={12}
            scrollWheelZoom={false}
            className="h-[400px] w-full z-0"
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={[farm.address.latitude, farm.address.longitude]}>
                <Popup>
                    {farm.farmName} <br /> {farm.address.fullAddress}
                </Popup>
            </Marker>
        </MapContainer>
    );
};