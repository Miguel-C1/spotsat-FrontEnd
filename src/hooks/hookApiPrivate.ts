import { api_private } from "../axios/api.ts";
import { useEffect } from "react";
import useRefreshToken from "./hookRefreshToken.ts";
import useAuth from "./hookAuthUser.ts";

const useApiPrivate = () => {
    const refresh = useRefreshToken();
    const { auth } = useAuth();

    useEffect(() => {

        const requestIntercept = api_private.interceptors.request.use(
            config => {
                if (config.headers && !config.headers['Authorization']) {
                    config.headers['Authorization'] = `Bearer ${auth?.token}`;
                }
                return config;
            }, (error) => Promise.reject(error)
        );

        const responseIntercept = api_private.interceptors.response.use(
            response => response,
            async (error) => {
                const prevRequest = error?.config;
                if (error?.response?.status === 403 && !prevRequest?.sent) {
                    prevRequest.sent = true;
                    const newAccessToken = await refresh();
                    prevRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
                    return api_private(prevRequest);
                }
                return Promise.reject(error);
            }
        );

        return () => {
            api_private.interceptors.request.eject(requestIntercept);
            api_private.interceptors.response.eject(responseIntercept);
        }
    }, [auth, refresh])

    return api_private;
}

export default useApiPrivate;