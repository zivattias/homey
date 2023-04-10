import axios, { AxiosError } from "axios";
import { API_ENDPOINTS, FULL_API_ENDPOINT } from "../consts";

async function refreshAccessToken(refreshToken: string) {
    try {
        const response = await axios.post(
            FULL_API_ENDPOINT +
                API_ENDPOINTS.AUTH.BASE +
                API_ENDPOINTS.AUTH.REFRESH,
            { refresh: refreshToken }
        );
        return response.data.access;
    } catch (e) {
        if (e instanceof AxiosError) {
            if (e.response) {
                console.log(
                    "AxiosError: " + e.response.status,
                    e.response.data
                );
            }
        } else {
            throw new Error(String(e));
        }
    }
}

export default refreshAccessToken;
