// Constant utility variables

// API URLs & endpoints:
export const BASE_API_URL =
  process.env.NODE_ENV === "development"
    ? "http://127.0.0.1:"
    : "http://ec2-3-82-146-235.compute-1.amazonaws.com/";
export const BASE_API_PORT =
  process.env.NODE_ENV === "development" ? "8000/" : "";
export const BASE_API_ENDPOINT = "api/";
export const FULL_API_ENDPOINT =
  BASE_API_URL + BASE_API_PORT + BASE_API_ENDPOINT;

export const API_ENDPOINTS = {
  AUTH: {
    BASE: "auth/",
    GOOGLE_OAUTH: "google-oauth/",
    LOGIN: "login/",
    REGISTER: "register/",
    REFRESH: "refresh/",
    LOGOUT: "logout/",
    USER_EXISTS: "user_exists/",
    EMAIL_EXISTS: "email_exists/",
  },
  ME: "me/",
  USERS: "users/",
  UPLOAD_PIC: "upload_pic/",
  APARTMENTS: {
    BASE: "apartments/",
  },
  LISTINGS: {
    BASE: "listings/",
    LIKE: "like/",
  },
  PROPOSALS: "proposals/",
  REVIEWS: "reviews/",
};
