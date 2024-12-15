import React from 'react';
import { MapContainer, TileLayer, Marker, Tooltip } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Icon } from 'leaflet';
import { Farm } from '../types';

const customIcon = new Icon({
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    shadowSize: [41, 41],
});

interface MapComponentProps {
    farm: Farm;
}

export const MapComponent: React.FC<MapComponentProps> = ({ farm }) => {
    if (!farm?.address) return <>Error loading map</>;
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
            <Marker position={[farm.address.latitude, farm.address.longitude]} icon={customIcon}>
                <Tooltip offset={[0, 20]} opacity={1} >
                    {farm.farmName} <br /> {farm.address.fullAddress}
                </Tooltip>
            </Marker>
        </MapContainer>
    );
};

