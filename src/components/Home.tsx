import React, { useContext } from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";
import { useNavigate } from "react-router-dom";
import AuthContext from "../context/ProviderAuth.tsx";
import MapWithDrawControl from "./MapwithDrawControl.tsx";

const Home = () => {
    const position: [number, number] = [51.505, -0.09]; // Coordenadas iniciais do mapa
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
        navigate("/new-route");
    };

    return (
        <section>
            <h1>Home</h1>
            <p>Você está Logado!</p>
            <MapContainer center={position} zoom={13} scrollWheelZoom={false} style={{ height: "500px", width: "100%" }}>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <MapWithDrawControl />
            </MapContainer>

            <div>
                <button onClick={logout}>Sign Out</button>
                <button onClick={goToAnotherRoute}>Go to New Route</button> {/* Novo botão */}
            </div>
        </section>
    );
};

export default Home;
