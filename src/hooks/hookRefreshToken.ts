import axios from '../axios/api.ts';
import useAuth from './hookAuthUser.ts';

const useRefreshToken = () => {
    const { setAuth } = useAuth();

    const refresh = async () => {
        interface RefreshResponse {
            token: string;
        }

        const response = await axios.get<RefreshResponse>('/refresh', {
            withCredentials: true
        });
        setAuth(prev => {
            console.log(JSON.stringify(prev));
            console.log(response.data.token);
            return { ...prev, token: response.data.token }
        });
        return response.data.token;
    }
    return refresh;
};

export default useRefreshToken;