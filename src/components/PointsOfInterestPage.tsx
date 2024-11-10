import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Polygon } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";
import { LatLngExpression } from 'leaflet';
import "../styles/home.css";
import useApiPrivate from "../hooks/hookApiPrivate.ts";
import { PolygonType } from "../types/polygon.ts";
import { useParams, useNavigate } from "react-router-dom";
import proj4 from "proj4";
import * as L from "leaflet";
import "proj4leaflet";
import PointsOfInterestMap from "./PointsOfInterestMap.jsx";

L.Icon.Default.mergeOptions({
    iconRetinaUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-icon.png",
    iconUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-icon.png",
    shadowUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-shadow.png",
});

proj4.defs("EPSG:5880", "+proj=poly +lat_0=0 +lon_0=-54 +x_0=5000000 +y_0=10000000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs");


const PointsOfInterestPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const api = useApiPrivate();
    const [position, setPosition] = useState<[number, number]>([-14.2350, -51.9253]); // Posição inicial do mapa
    const [isLoading, setIsLoading] = useState(true);

    const goToAnotherRoute = () => {
        navigate("/search");
    };

    const fetchPolygonData = async () => {
        setIsLoading(true); // Começa o carregamento
        try {
            api.get<PolygonType>(`/polygons/${id}`);
       

        } catch (error) {
            console.error('Erro ao carregar os dados do polígono:', error);
        } finally {
            setIsLoading(false); // Fim do carregamento
        }
    };

    useEffect(() => {
        fetchPolygonData();
    }, [id]);

    return (
        <section className="section-container">
            {isLoading ? (
                <p>Carregando...</p>
            ) : (
                <MapContainer className="map-container" center={position} zoom={6} scrollWheelZoom={false}>
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                
                    <PointsOfInterestMap url={`/polygons/${id}/interests`} />
                </MapContainer>
            )}
             <div>
                <button onClick={goToAnotherRoute}>Voltar</button>
            </div>
        </section>
    );
};

export default PointsOfInterestPage;
