import axios, { AxiosResponse } from "axios";

async function sendRequest(
    method: "post" | "get" | "patch" | "put" | "delete",
    url: string,
    accessToken: string,
    data: { [key: string]: string }
): Promise<AxiosResponse> {
    const headers = accessToken
        ? { Authorization: `Bearer ${accessToken}` }
        : {};
    const response = await axios({
        method: method,
        url: url,
        data: data,
        headers: headers,
    });
    return response;
}

export default sendRequest;
