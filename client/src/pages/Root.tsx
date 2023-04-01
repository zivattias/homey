import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function Root() {
    return (
        <React.Fragment>
            <Navbar></Navbar>
            <Outlet />
        </React.Fragment>
    );
}
