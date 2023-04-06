import axios from "axios";
import refreshAccessToken from "./refreshAccessToken";

async function sendRequest(
    method: string,
    endpoint: string,
    accessToken: string,
    refreshToken: string
) {
    const response = await (axios as any)[method](endpoint, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });
    if (response.status === 403) {
        const newAccessToken = await refreshAccessToken(refreshToken);
        if (newAccessToken && newAccessToken !== accessToken) {
            sendRequest(method, endpoint, newAccessToken, refreshToken);
            return;
        }
    }
    return response;
}

export default sendRequest;
