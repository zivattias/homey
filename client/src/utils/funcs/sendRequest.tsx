import axios, { AxiosResponse } from "axios";
import refreshAccessToken from "./refreshAccessToken";

async function sendRequest(
    method: string,
    endpoint: string,
    accessToken: string,
    refreshToken: string,
    body: object
): Promise<AxiosResponse> {
    const headers = accessToken
        ? { Authorization: `Bearer ${accessToken}` }
        : {};
    const options = { headers, ...body };
    const response = await (axios as any)[method](endpoint, options);

    if (response.status === 401) {
        console.log("Got unauthorized, getting new accessToken");
        const newAccessToken = await refreshAccessToken(refreshToken);

        if (newAccessToken && newAccessToken !== accessToken) {
            return sendRequest(
                method,
                endpoint,
                newAccessToken,
                refreshToken,
                body
            );
        }
    }

    return response as AxiosResponse;
}

export default sendRequest;
