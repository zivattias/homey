import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { UserProvider } from "./context/UserContext";
import "./index.css";
import { ApartmentProvider } from "./context/ApartmentContext";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    // <React.StrictMode>
    <UserProvider>
        <ApartmentProvider>
            <BrowserRouter>
                <App />
            </BrowserRouter>
        </ApartmentProvider>
    </UserProvider>
    // </React.StrictMode>
);
