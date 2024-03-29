import { createContext, useCallback, useEffect, useMemo, useState, useContext } from "react";
import { AuthService } from "../services/api/auth/AuthService";
import { Environment } from "../environment";

interface IAuthContextData {
    isAuthenticated: boolean;
    logout: () => void;
    login: (email: string, password: string) => Promise<string | void>;
};

interface IAuthProviderProps {
    children: React.ReactNode
}

const AuthContext = createContext({} as IAuthContextData)

export const AuthProvider: React.FC<IAuthProviderProps> = ({ children }) => {
    const [accessToken, setAccessToken] = useState<string>();

    useEffect(() => {
        const accessToken = localStorage.getItem(Environment.LOCAL_STORAGE_KEY__ACCESS_TOKEN);

        if (accessToken){
            setAccessToken(accessToken);

        } else {
            setAccessToken(undefined);
        }
    },[])

    const handleLogin = useCallback(async (email: string, password: string) => {
        const result = await AuthService.auth(email, password);

        if (result instanceof Error){
            return result.message;

        } else {
            localStorage.setItem(Environment.LOCAL_STORAGE_KEY__ACCESS_TOKEN, result.accessToken);
            setAccessToken(result.accessToken);
        }
    }, []);

    const handleLogout = useCallback(() => {
        localStorage.removeItem(Environment.LOCAL_STORAGE_KEY__ACCESS_TOKEN);
        setAccessToken(undefined);
    }, []);

    const isAuthenticated = useMemo(() => !!accessToken, [accessToken]);

    return(
         <AuthContext.Provider value={{ isAuthenticated, login: handleLogin, logout: handleLogout}}>
            {children}
         </AuthContext.Provider>   
    );
};

export const useAuthContext = () => useContext(AuthContext)