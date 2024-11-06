import { useContext, useDebugValue } from "react";
import AuthContext from "../context/ProviderAuth.tsx";

const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    const { auth } = context;
    useDebugValue(auth, auth => auth?.username ? "Logged In" : "Logged Out")
    return context;
}

export default useAuth;