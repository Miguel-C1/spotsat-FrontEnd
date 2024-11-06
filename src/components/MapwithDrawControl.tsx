import { useEffect, useState } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-draw";
import "leaflet-draw/dist/leaflet.draw.css";

interface MapWithDrawControlProps {
    geoJsonUrl?: string;
}

const MapWithDrawControl: React.FC<MapWithDrawControlProps> = ({ geoJsonUrl }) => {
    const map = useMap(); 
    const [geojson, setGeojson] = useState<any>({ type: "FeatureCollection", features: [] });

    useEffect(() => {
        const drawControl = new L.Control.Draw({
            edit: {
                featureGroup: new L.FeatureGroup(),
            },
        });
        map.addControl(drawControl);
        console.log(geojson)
        map.on("draw:created", (event) => {
            const layer = event.layer;
            const newGeojson = {
                type: "Feature",
                geometry: layer.toGeoJSON().geometry,
                properties: {},
            };

            setGeojson((prevState: any) => ({
                ...prevState,
                features: [...prevState.features, newGeojson],
            }));

            layer.addTo(map);
        });

        return () => {
            map.removeControl(drawControl);
        };
    }, [map]);
    console.log(geojson)
    return null;
};

export default MapWithDrawControl;

