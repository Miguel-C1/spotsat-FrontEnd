import React from 'react';
import { MapContainer, TileLayer, FeatureGroup } from 'react-leaflet';
import { EditControl } from 'react-leaflet-draw';
import * as L from "leaflet";
import proj4 from "proj4";
import "proj4leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";
import "../styles/home.css";

proj4.defs("EPSG:5880", "+proj=poly +lat_0=0 +lon_0=-54 +x_0=5000000 +y_0=10000000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs");


const MapComponent = ({ onCreate, onUpdate, onDelete, latitude, longitude, zoomLevel }) => (



    <MapContainer center={[latitude, longitude]} zoom={zoomLevel} scrollWheelZoom={false} >
        <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <FeatureGroup>
            <EditControl
                position="topright"
                onCreated={onCreate}
                onEdited={onUpdate}
                onDeleted={onDelete}
                draw={{
                    rectangle: false,
                    circle: false,
                    polyline: false,
                    marker: false,
                }}
            />
        </FeatureGroup>
    </MapContainer>
);

export default MapComponent;