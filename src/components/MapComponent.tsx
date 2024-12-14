import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polygon } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';


interface MapProps {
    farmName: string;
    latitude: number;
    longitude: number;
    coordinates: [number, number][]
}

export const MapComponent: React.FC<MapProps> = ({ farmName, latitude, longitude, coordinates }) => {
    return (
        <MapContainer
            center={[latitude, longitude]}
            zoom={10}
            scrollWheelZoom={false}
            style={{ height: '400px', width: '100%' }}
        >
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                // attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <Marker position={[latitude, longitude]}>
                <Popup>
                    {farmName ?? "Localização encontrada"}
                </Popup>
            </Marker>
            <Polygon
                positions={coordinates ?? [0, 0]}
                pathOptions={{
                    color: 'blue',
                    fillColor: 'blue',
                    fillOpacity: 0.2,
                }}
            />
        </MapContainer>
    );
};