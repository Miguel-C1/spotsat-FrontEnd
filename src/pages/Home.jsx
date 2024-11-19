import React, { useContext } from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";
import "../styles/home.css";
import { useNavigate } from "react-router-dom";
import AuthContext from "../context/ProviderAuth.tsx";
import * as L from "leaflet";
import proj4 from "proj4";
import "proj4leaflet";
import MapWithDrawControl from "../components/MapwithDrawControl.jsx";

L.Icon.Default.mergeOptions({
    iconRetinaUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-icon.png",
    iconUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-icon.png",
    shadowUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-shadow.png",
  });

proj4.defs("EPSG:5880","+proj=poly +lat_0=0 +lon_0=-54 +x_0=5000000 +y_0=10000000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs");

const Home = () => {
    const position = [-14.2350, -51.9253]; // Centralizando no Brasil
    const authContext = useContext(AuthContext);


    if (!authContext) {
        throw new Error("AuthContext must be used within an AuthProvider");
    }
    const { setAuth } = authContext;
    const navigate = useNavigate();

    const logout = () => {
        setAuth({ username: null, password: null, token: null });
        navigate("/login");
    };

    const goToAnotherRoute = () => {
        navigate("/search");
    };
    const goToSearchByRadius = () => {
        navigate("/searchradius");
    };


    return (
        <section className="section-container">
            <MapContainer 
                className="map-container" 
                center={position} 
                zoom={5}  // Ajuste o zoom para uma visão melhor do Brasil
                scrollWheelZoom={false} 
            >
                {/* Usando o TileLayer padrão com EPSG:3857 para os tiles */}
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <MapWithDrawControl url="/polygons/" />
            </MapContainer>

            <div>
                <button onClick={logout}>Sign Out</button>
                <button onClick={goToAnotherRoute}>Buscar Polígonos</button>
                <button onClick={goToSearchByRadius}>Buscar Interesse Por Raio</button>
            </div>
        </section>
    );
};

export default Home;
