import React, { createContext, useState } from "react";


interface AuthContextType {

    auth: {

        username: string | null;
        password: string | null;
        token: string | null;
    };

    setAuth: React.Dispatch<React.SetStateAction<{ username: string | null; password: string | null; token: string | null }>>;

}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState<{ username: string | null; password: string | null; token: string | null }>({ username: null, password: null, token: null });

    return (
        <AuthContext.Provider value={{ auth, setAuth }}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthContext;