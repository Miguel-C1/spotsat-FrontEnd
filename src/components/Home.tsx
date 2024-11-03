import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { useContext } from "react";
import AuthContext from "../context/ProviderAuth.tsx";

const Home = () => {
    const authContext = useContext(AuthContext);
    if (!authContext) {
        throw new Error("AuthContext must be used within an AuthProvider");
    }
    const { setAuth } = authContext;
    const navigate = useNavigate();

    const logout = async () => {

        setAuth({ user: null, pwd: null, accessToken: null });
        navigate('/');
    }

    return (
        <section>
            <h1>Home</h1>
            <br />
            <p>Você está Logado!</p>
            <br />
          
            <div className="flexGrow">
                <button onClick={logout}>Sign Out</button>
            </div>
        </section>
    )
}

export default Home