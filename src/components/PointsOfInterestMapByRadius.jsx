import React, { useEffect, useState } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import proj4 from "proj4";
import "../styles/PolygonsByRadius.css";

proj4.defs("EPSG:5880", "+proj=poly +lat_0=0 +lon_0=-54 +x_0=5000000 +y_0=10000000 +ellps=GRS80 +units=m +no_defs");

const PointsOfInterestMapByRadius = ({ polygons }) => {
    const map = useMap();
    const [pointsOfInterest, setPointsOfInterest] = useState([]);

    useEffect(() => {
        const transformedData = polygons.map((feature) => {
            const { type, coordinates } = feature.geometry;
    
            if (type === "Point") {
                return {
                    ...feature,
                    geometry: {
                        ...feature.geometry,
                        coordinates: proj4("EPSG:5880", "EPSG:4326", coordinates)
                    }
                };
            } else if (type === "Polygon") {
                return {
                    ...feature,
                    geometry: {
                        ...feature.geometry,
                        coordinates: coordinates.map((ring) =>
                            ring.map(([x, y]) => proj4("EPSG:5880", "EPSG:4326", [x, y]))
                        )
                    }
                };
            }
            return feature; 
        });
    
        setPointsOfInterest(transformedData);
    }, [polygons]);

    useEffect(() => {
        map.eachLayer((layer) => {
            if (layer instanceof L.Polygon || layer instanceof L.Marker) {
                map.removeLayer(layer);
            }
        });
        if (!map || pointsOfInterest.length === 0) return;

        pointsOfInterest.forEach((point) => {
            const { coordinates, type } = point.geometry;

            if (type === "Polygon") {
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
                        .setContent(`<strong>Nome:${point.name}</strong><br><strong>Desc:${point.properties.description}</strong><br>${point.geometry.crs.properties.name}`)
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
            } else if (type === "Point") {
                const [lat, lon] = coordinates;
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
    }, [pointsOfInterest]);

    return null;
};

export default PointsOfInterestMapByRadius;
