import React, { createContext, useState } from "react";


interface AuthContextType {

    auth: {

        user: string | null;
        pwd: string | null;
        accessToken: string | null;
    };

    setAuth: React.Dispatch<React.SetStateAction<{ user: string | null; pwd: string | null; accessToken: string | null }>>;

}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState<{ user: string | null; pwd: string | null; accessToken: string | null }>({ user: null, pwd: null, accessToken: null });

    return (
        <AuthContext.Provider value={{ auth, setAuth }}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthContext;