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
        let drawControl
        const featureGroup = featureGroupRef.current;
        if(polygon.geometry?.type === "Point"){
            drawControl = new L.Control.Draw({
                edit: {
                    featureGroup: featureGroupRef.current,
                },
                draw: {
                    circlemarker: false,  
                    rectangle: false,
                    circle: false,
                    polyline: false,
                    polygon: false,
                    marker: polygon.geometry?.type === "Point", 
                },
            });
        } else {
            drawControl = new L.Control.Draw({
                edit: {
                    featureGroup: featureGroupRef.current,
                },
                draw: {
                    circlemarker: false,  
                    circle: false,
                    polyline: false,
                    polygon: true,
                    marker: false, 
                },
            });
        }
    
        map.addControl(drawControl);

        map.on("draw:created", (e) => {
            const layer = e.layer;

            featureGroup.clearLayers();
            featureGroupRef.current.addLayer(layer);

            const newGeoJson = featureGroupRef.current.toGeoJSON();
            setGeojson(newGeoJson);

            layer.on("click", () => {
                if (layer.editing) layer.editing.enable();
            });
        });

        return () => {
            map.removeControl(drawControl);
        };
    }, [map]);

    useEffect(() => {
        if (!polygon) return;

        console.log("Desenhando geometria:", polygon);
    
        const featureGroup = featureGroupRef.current;

        if (polygon.geometry.type === "Polygon") {
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
            
            featureGroup.clearLayers();
            
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
                    if (layer.editing) layer.editing.enable();
                });
                layer.on("edit", () => {
                    const updatedGeoJson = featureGroup.toGeoJSON();
                    setGeojson(updatedGeoJson);
                });
                layer.on("mouseover", (e) => {
                    const popup = L.popup()
                        .setLatLng(e.latlng)
                        .setContent(`<strong>${polygon.properties.name}</strong><br>${polygon.properties.description}`)
                        .openOn(map);
                    e.target.setStyle({ color: "#FF5733", weight: 5 });
                });
                layer.on("mouseout", (e) => {
                    map.closePopup();
                    e.target.setStyle({ color: "#ff0000", weight: 4 });
                });
            });

            map.addLayer(featureGroup);
            setGeojson(geojson);
        } else if (polygon.geometry.type === "Point") {
            const [x, y] = polygon.geometry.coordinates;
            const [lon, lat] = proj4("EPSG:5880", "EPSG:4326", [x, y]);
            const marker = L.marker([lat, lon]).bindPopup(
                `<strong>${polygon.properties.name}</strong><br>${polygon.properties.description}`
            );
            
            featureGroup.clearLayers();
            featureGroup.addLayer(marker);
            map.addLayer(featureGroup);
            setGeojson({
                "type": "FeatureCollection",
                "features": [
                    {
                        "type": "Feature",
                        "properties": {
                            "name": polygon.properties.name,
                            "description": polygon.properties.description,
                        },
                        "geometry": {
                            "type": "Point",
                            "coordinates": [x, y],
                        },
                    },
                ],
            });
        }
    
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
