// Constant utility variables

// API URLs & endpoints:
export const BASE_API_URL = "http://127.0.0.1:";
export const BASE_API_PORT = "8000/";
export const BASE_API_ENDPOINT = "api/";
export const FULL_API_ENDPOINT =
    BASE_API_URL + BASE_API_PORT + BASE_API_ENDPOINT;

export const API_ENDPOINTS = {
    AUTH: {
        BASE: "auth/",
        LOGIN: "login/",
        REGISTER: "register/",
        REFRESH: "refresh/",
        LOGOUT: "logout/",
    },
    ME: "me/",
    APARTMENTS: {
        BASE: "apartments/",
        LIKE: "like/",
    },
    LISTINGS: "listings/",
    PROPOSALS: "proposals/",
    REVIEWS: "reviews/",
};