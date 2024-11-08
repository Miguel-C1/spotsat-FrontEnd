import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Polygon } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";
import { LatLngExpression } from 'leaflet';
import "../styles/home.css";
import useApiPrivate from "../hooks/hookApiPrivate.ts";
import { PolygonType } from "../types/polygon.ts";
import { useParams } from "react-router-dom";
import proj4 from "proj4";
import * as L from "leaflet";
import "proj4leaflet";
import MapWithDrawControlEdit from "./MapwithDrawControlEdit.jsx";
import { useNavigate } from "react-router-dom";


L.Icon.Default.mergeOptions({
    iconRetinaUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-icon.png",
    iconUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-icon.png",
    shadowUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-shadow.png",
});

proj4.defs("EPSG:5880", "+proj=poly +lat_0=0 +lon_0=-54 +x_0=5000000 +y_0=10000000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs");


const EditorPolygonPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const api = useApiPrivate();
    const [position, setPosition] = useState<[number, number]>([-14.2350, -51.9253]); // Posição inicial do mapa
    const [polygon, setPolygon] = useState<PolygonType | undefined>(undefined);
    const [polygonCoordinates, setPolygonCoordinates] = useState<LatLngExpression[][] | undefined>(undefined);
    const [isLoading, setIsLoading] = useState(true);

    const handlePolygonClick = (polygon: PolygonType | undefined) => {
        if (polygon) {
            // Exibir detalhes do polígono
            alert(`Detalhes do polígono: ${polygon.name}`);
        }
    };

    const convertCoordinates = (coordinates) => {
        return coordinates.map((point) => {
            const [x, y] = proj4("EPSG:5880", "EPSG:3857", point);
            return [y, x]; // Leaflet espera [latitude, longitude]
        });
    };

    const goToAnotherRoute = () => {
        navigate("/search");
    };

    const fetchPolygonData = async () => {
        setIsLoading(true); // Começa o carregamento
        try {
            const response = await api.get<PolygonType>(`/polygons/${id}`);
            const data = response.data;

            const coordinates: LatLngExpression[][] = data.geometry.coordinates.map((ring: number[][]) =>
                ring.map((coord: number[]) => [coord[1], coord[0]] as LatLngExpression)
            );

            const test = convertCoordinates(data.geometry.coordinates[0]);

            console.log(coordinates)

            const geojson = {
                type: "FeatureCollection",
                features: [
                    {
                        type: "Feature",
                        properties: {
                            name: data.properties.name,
                            description: data.properties.description,
                        },
                        geometry: {
                            type: "Polygon",
                            coordinates: data.geometry.coordinates,
                        },
                    },
                ],
            }


            setPolygon(data);
            setPolygonCoordinates(coordinates);
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
                    {polygonCoordinates && (
                        <Polygon
                            key={1}
                            positions={polygonCoordinates}
                            eventHandlers={{ click: () => handlePolygonClick(polygon) }}
                        />
                    )}

                    <MapWithDrawControlEdit url={`/polygons/${id}`} polygon={polygon} />
                </MapContainer>
            )}
             <div>
                <button onClick={goToAnotherRoute}>Voltar</button>
            </div>
        </section>
    );
};

export default EditorPolygonPage;
