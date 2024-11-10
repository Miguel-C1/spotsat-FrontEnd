import React, { useEffect, useState } from "react";
import { useMap } from "react-leaflet";
import { useParams } from "react-router-dom";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import proj4 from "proj4";
import useApiPrivate from "../hooks/hookApiPrivate.ts";

proj4.defs("EPSG:5880", "+proj=poly +lat_0=0 +lon_0=-54 +x_0=5000000 +y_0=10000000 +ellps=GRS80 +units=m +no_defs");

const PointsOfInterestMap = ({ url }) => {
    const { id } = useParams();
    const map = useMap();
    const api = useApiPrivate();
    const [pointsOfInterest, setPointsOfInterest] = useState([]);

    useEffect(() => {
        if (!id) return;
        api.get(url)
            .then((response) => {
                const data = response.data;
                const transformedData = data.map((point) => {
                    const coordinates = point.geometry.coordinates;

                    // Verifique se é um Point ou Polygon
                    const transformedCoordinates = point.geometry.type === "Point"
                        ? proj4("EPSG:5880", "EPSG:4326", coordinates) // Apenas uma coordenada para Point
                        : coordinates.map((coords) => 
                            coords.map(([x, y]) => proj4("EPSG:5880", "EPSG:4326", [x, y]))
                        ); // Array de coordenadas para Polygon

                    return {
                        ...point,
                        geometry: {
                            ...point.geometry,
                            coordinates: transformedCoordinates,
                        }
                    };
                });
                setPointsOfInterest(transformedData);
            })
            .catch((error) => {
                console.error("Erro ao buscar pontos de interesse:", error);
            });
    }, [id, api]);

    useEffect(() => {
        if (!map || pointsOfInterest.length === 0) return;

        pointsOfInterest.forEach((point) => {
            const { coordinates } = point.geometry;

            if (point.geometry.type === "Polygon") {
                const latLngs = coordinates[0].map(([lat, lon]) => [lon, lat]);

                const polygonLayer = L.polygon(latLngs, {
                    color: "blue",
                    weight: 2,
                    fillColor: "#cce5ff",
                    fillOpacity: 0.4,
                }).addTo(map);

                polygonLayer.on("mouseover", (e) => {
                    const popup = L.popup()
                        .setLatLng(e.latlng)
                        .setContent(
                            `<strong>Nome: ${point.name}</strong><br><strong>Desc: ${point.properties.description}</strong><br>${point.geometry.crs.properties.name}`
                        )
                        .openOn(map);

                    e.target.setStyle({
                        color: "#FF5733",
                        weight: 3,
                    });
                });

                polygonLayer.on("mouseout", (e) => {
                    map.closePopup();

                    e.target.setStyle({
                        color: "blue",
                        weight: 2,
                    });
                });
            } else if (point.geometry.type === "Point") {
                const [lat, lon] = coordinates; // Para Point, não é um array de arrays

                const marker = L.marker([lon, lat]).addTo(map);

                marker.bindPopup(
                    `<strong>Nome: ${point.name}</strong><br><strong>Desc: ${point.properties.description}</strong><br>${point.geometry.crs.properties.name}`
                );

                marker.on("mouseover", () => {
                    marker.openPopup();
                });

                marker.on("mouseout", () => {
                    marker.closePopup();
                });
            }
        });
    }, [pointsOfInterest, map]);

    return null;
};

export default PointsOfInterestMap;
