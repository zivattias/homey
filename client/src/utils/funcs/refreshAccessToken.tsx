import axios from "axios";
import { API_ENDPOINTS, FULL_API_ENDPOINT } from "../consts";
import { USER_ACTIONS, useUserDispatch } from "../../context/UserContext";

async function refreshAccessToken(refreshToken: string) {
    const dispatch = useUserDispatch();
    const response = await axios.post(
        FULL_API_ENDPOINT +
            API_ENDPOINTS.AUTH.BASE +
            API_ENDPOINTS.AUTH.REFRESH,
        { refresh: refreshToken }
    );
    if (response.status === 200) {
        dispatch({
            type: USER_ACTIONS.REFRESH_ACCESS_TOKEN,
            payload: {
                accessToken: response.data.access,
            },
        });
        return response.data.access;
    }
    throw new Error("Invalid or expired refresh token, re-login.");
}

export default refreshAccessToken;
