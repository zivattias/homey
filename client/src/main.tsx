import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { UserProvider } from "./context/UserContext";
import "./index.css";
import { ApartmentProvider } from "./context/ApartmentContext";
import { transitions, positions, Provider as AlertProvider } from "react-alert";
import AlertTemplate from "./components/AlertTemplate";

const alertOptions = {
  position: positions.BOTTOM_RIGHT,
  timeout: 3000,
  offset: "15px",
  transition: transitions.SCALE,
};

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  // <React.StrictMode>
  <UserProvider>
    <ApartmentProvider>
      <AlertProvider template={AlertTemplate} {...alertOptions}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </AlertProvider>
    </ApartmentProvider>
  </UserProvider>
  // </React.StrictMode>
);
