import React, { useEffect, useState, useRef } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-draw";
import "leaflet-draw/dist/leaflet.draw.css";
import useApiPrivate from "../hooks/hookApiPrivate.ts";
import { useNavigate } from "react-router-dom";
import proj4 from "proj4";

proj4.defs("EPSG:5880", "+proj=poly +lat_0=0 +lon_0=-54 +x_0=5000000 +y_0=10000000 +ellps=GRS80 +units=m +no_defs");

const MapWithDrawControlEdit = ({ url, polygon }) => {
    const navigate = useNavigate();
    const map = useMap();
    const [geojson, setGeojson] = useState(null);
    const featureGroupRef = useRef(new L.FeatureGroup());
    const api = useApiPrivate();

    const [polygonName, setPolygonName] = useState("");
    const [polygonDescription, setPolygonDescription] = useState("");

    const convertToLatLng = (coordinates) => {
        return coordinates.map(([x, y]) => {
            const [lon, lat] = proj4("EPSG:5880", "EPSG:4326", [x, y]);
            return [lon, lat]; // Leaflet espera coordenadas [latitude, longitude]
        });
    };

    useEffect(() => {
        if (!map) return;

        const featureGroup = featureGroupRef.current;

        const drawControl = new L.Control.Draw({
            edit: {
                featureGroup: featureGroupRef.current,
            },
            draw: {
                marker: false,
                circlemarker: false,    
                polyline: false,
                circle: false,
                rectangle: false,
                polygon: true, // Permite desenhar apenas polígonos
            },
        });

        map.addControl(drawControl);

        map.on("draw:created", (e) => {
            const layer = e.layer;

            // Limpa qualquer polígono existente antes de adicionar um novo
            featureGroup.clearLayers();
            featureGroupRef.current.addLayer(layer);

            const newGeoJson = featureGroupRef.current.toGeoJSON();
            setGeojson(newGeoJson);

            // Ativar edição ao clicar no polígono
            layer.on("click", () => {
                layer.editing.enable();
            });
        });

        return () => {
            map.removeControl(drawControl); 
        };
    }, [map]);

    useEffect(() => {
        if (!polygon) return;
    
        const featureGroup = featureGroupRef.current;
        const geojson = {
            "type": "FeatureCollection",
            "features": [
                {
                    "type": "Feature",
                    "properties": {
                        "name": polygon.properties.name,
                        "description": polygon.properties.description,
                    },
                    "geometry": {
                        "type": "Polygon",
                        "coordinates": [
                            convertToLatLng(polygon.geometry.coordinates[0])
                        ],
                    },
                },
            ],
        };
    
        // Limpar as camadas anteriores
        featureGroup.clearLayers();
    
        // Criar a camada GeoJSON
        const layer = L.geoJSON(geojson, {
            style: {
                color: "#ff0000",
                weight: 4,
                fillColor: "#ffcccc",
                fillOpacity: 0.5,
            },
        });
    
        layer.eachLayer((layer) => {
            featureGroup.addLayer(layer);
    
            layer.on("click", () => {
                if (layer.editing) {
                    layer.editing.enable();
                }
            });
    
            layer.on("edit", () => {
                const updatedGeoJson = featureGroup.toGeoJSON();
                setGeojson(updatedGeoJson);
            });
        });
    
        map.addLayer(featureGroup);
    
        setGeojson(geojson);
        setPolygonName(polygon.properties.name);
        setPolygonDescription(polygon.properties.description);
    }, [polygon, map]);

    const handleSendGeoJson = () => {
        if (url && geojson) {
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

            api.put(url, updatedGeojson)
                .then((response) => {
                    console.log("Dados enviados com sucesso:", response.data);
                    featureGroupRef.current.clearLayers();
                    setGeojson(null);
                    setPolygonName("");
                    setPolygonDescription("");
                    navigate("/search");
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
                <button onClick={handleSendGeoJson}>Alterar GeoJSON</button>
            </div>
        </div>
    );
};

export default MapWithDrawControlEdit;
