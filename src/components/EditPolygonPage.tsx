import React, { useContext, useState } from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";
import "../styles/home.css"
import useApiPrivate from "../hooks/hookApiPrivate.ts";

import { useNavigate, useParams } from "react-router-dom";
import MapWithDrawControl from "./MapwithDrawControl.tsx";


const EditorPolygonPage = () => {

    const { id } = useParams();
    const api = useApiPrivate();
    const [position, setPosition] = useState<[number, number]>([51.505, -0.09]); // Posição inicial do mapa



    const fetchPolygonData = async () => {
        try {
            const response = await api.get(`/polygons/${id}`);
            const data = response.data as { geometry: { coordinates: number[][][] } };
            const coordinates = data.geometry.coordinates[0]; 
            const lat = coordinates[0][1];
            const lng = coordinates[0][0]; 
            setPosition([lat, lng]);
        } catch (error) {
            console.error('Erro ao carregar os dados do polígono:', error);
        }
    };

    return (
        <section className="section-container">
            <MapContainer className="map-container" center={position} zoom={13} scrollWheelZoom={false}>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <MapWithDrawControl url="/polygons/" />
            </MapContainer>
        </section>
    );
};

export default EditorPolygonPage;

