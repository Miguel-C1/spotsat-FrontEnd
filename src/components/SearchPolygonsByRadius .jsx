import React, { useState } from "react";
import { MapContainer, TileLayer, useMapEvents } from "react-leaflet";
import useApiPrivate from "../hooks/hookApiPrivate.ts";
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";
import "../styles/home.css";
import { useNavigate } from "react-router-dom";
import PointsOfInterestMapByRadius from "./PointsOfInterestMapByRadius.jsx";

const SearchPolygonsByRadius = () => {
    const [latitude, setLatitude] = useState("");
    const [longitude, setLongitude] = useState("");
    const [radius, setRadius] = useState("");
    const [polygons, setPolygons] = useState([]);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const api = useApiPrivate();

    const handleSearch = async () => {
        if (!latitude || !longitude || !radius) {
            setError("Por favor, preencha todos os campos.");
            return;
        }

        try {
            const response = await api.get(`/polygons/search`, {
                params: {
                    latitude: latitude,
                    longitude: longitude,
                    radius: radius,
                },
            });
            setPolygons(response.data);
            setError(null);
        } catch (error) {
            setError("Erro ao buscar polígonos: " + error.message);
        }
    };

    const goBackToHome = () => {
        navigate("/home");
    };
    const LocationMarker = () => {
        useMapEvents({
            click(event) {
                const { lat, lng } = event.latlng;
                setLatitude(lat);
                setLongitude(lng);
            },
        });
        return null;
    };

    return (
        <div>
            <h2>Buscar Polígonos por Raio</h2>
            <div className="input-container">
                <label>
                    Latitude:
                    <input
                        type="number"
                        value={latitude}
                        onChange={(e) => setLatitude(e.target.value)}
                        placeholder="Clique no mapa ou digite aqui"
                    />
                </label>
                <br />
                <label>
                    Longitude:
                    <input
                        type="number"
                        value={longitude}
                        onChange={(e) => setLongitude(e.target.value)}
                        placeholder="Clique no mapa ou digite aqui"
                    />
                </label>
                <br />
                <label>
                    Raio (em metros):
                    <input
                        type="number"
                        value={radius}
                        onChange={(e) => setRadius(e.target.value)}
                        placeholder="Ex: 1000"
                    />
                </label>
                <br />
                <button onClick={handleSearch}>Buscar Polígonos</button>
                {error && <p style={{ color: "red" }}>{error}</p>}
            </div>

            <MapContainer center={[-14.2350, -51.9253]} zoom={6} style={{ height: "400px", width: "100%" }}>
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <PointsOfInterestMapByRadius polygons={polygons} />
                <LocationMarker />
            </MapContainer>

            <div className="results-container">
                <h3>Resultados:</h3>
                {polygons.length > 0 ? (
                    polygons.map((polygon) => (
                        <table>
                            <thead>
                                <tr>
                                    <th>Nome</th>
                                    <th>Descrição</th>
                                    <th>Coordenadas</th>
                                </tr>
                            </thead>
                            <tbody>

                                <tr key={polygon.id}>
                                    <td>{polygon.properties.name}</td>
                                    <td>{polygon.properties.description}</td>
                                    <td>{JSON.stringify(polygon.geometry.coordinates)}</td>
                                </tr>

                            </tbody>
                        </table>
                    ))
                ) : (
                    <p>Nenhum polígono encontrado no raio especificado.</p>
                )}
            </div>
            <div>
                <button onClick={goBackToHome}>Voltar</button>
            </div>
        </div>
    );
};

export default SearchPolygonsByRadius;
