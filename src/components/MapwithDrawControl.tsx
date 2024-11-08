import React, { useEffect, useState, useRef } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-draw";
import "leaflet-draw/dist/leaflet.draw.css";
import useApiPrivate from "../hooks/hookApiPrivate.ts";

interface MapWithDrawControlProps {
    geoJsonUrl?: string;
    url?: string;
}

const MapWithDrawControl: React.FC<MapWithDrawControlProps> = ({ geoJsonUrl, url }) => {
    const map = useMap();
    const [geojson, setGeojson] = useState<GeoJSON.FeatureCollection | null>(null);
    const featureGroupRef = useRef(new L.FeatureGroup());
    const api = useApiPrivate();

    // Estado para os inputs
    const [polygonName, setPolygonName] = useState("");
    const [polygonDescription, setPolygonDescription] = useState("");

    useEffect(() => {
        const featureGroup = featureGroupRef.current;

        if (geoJsonUrl) {
            api.get(geoJsonUrl)
                .then((response) => {
                    if (response.data) {
                        const geoJsonLayer = L.geoJSON(response.data as GeoJSON.GeoJsonObject);
                        geoJsonLayer.addTo(featureGroup);
                    }
                })
                .catch((error) => {
                    console.error("Erro ao carregar GeoJSON:", error);
                });
        }

        map.addLayer(featureGroup);

        const drawControl = new L.Control.Draw({
            edit: {
                featureGroup: featureGroup,
            },
            draw: {
                polygon: {
                    shapeOptions: {
                        color: '#ff0000',
                        weight: 4,
                    }
                },
                polyline: false,
                circle: false,
            },
        });
        map.addControl(drawControl);

        // Limitar a um único polígono e capturar o evento `draw:created`
        map.on("draw:created", (event) => {
            const layer = (event as L.DrawEvents.Created).layer;

            // Remove o polígono anterior, se existir
            featureGroup.clearLayers();

            // Adiciona o novo polígono
            featureGroup.addLayer(layer);

            // Converte o `featureGroup` para GeoJSON e armazena no estado
            const updatedGeojson = featureGroup.toGeoJSON() as GeoJSON.FeatureCollection;
            setGeojson(updatedGeojson);
        });

        return () => {
            map.removeControl(drawControl);
            map.removeLayer(featureGroup);
        };
    }, [map, geoJsonUrl]);

    // Função para lidar com o envio do GeoJSON
    const handleSendGeoJson = () => {
        if (url && geojson) {
            // Adiciona os dados do formulário às propriedades do primeiro (e único) polígono
            const updatedGeojson = {
                ...geojson,
                features: geojson.features.map((feature) => ({
                    ...feature,
                    properties: {
                        ...feature.properties,
                        name: polygonName,
                        description: polygonDescription,
                    },
                })),
            };

            api.post(url, updatedGeojson)
                .then((response) => {
                    console.log("Dados enviados com sucesso:", response.data);
                    // Limpa o mapa e o estado após o envio
                    featureGroupRef.current.clearLayers();
                    setGeojson(null);
                    setPolygonName("");
                    setPolygonDescription("");
                })
                .catch((error) => {
                    console.error("Erro ao enviar GeoJSON:", error);
                });
        }
    };

    return (
        <div>

            <div className="input-container">
                <label>
                    Nome do Polígono:
                    <input
                        type="text"
                        value={polygonName}
                        onChange={(e) => setPolygonName(e.target.value)}
                    />
                </label>
                <br />
                <label>
                    Descrição:
                    <input
                        type="text"
                        value={polygonDescription}
                        onChange={(e) => setPolygonDescription(e.target.value)}
                    />
                </label>
                <br />
                <button onClick={handleSendGeoJson}>Enviar GeoJSON</button>
            </div>
        </div>
    );
};

export default MapWithDrawControl;
