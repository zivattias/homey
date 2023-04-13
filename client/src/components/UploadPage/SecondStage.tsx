import React from "react";
import { Apartment, useApartment } from "../../context/ApartmentContext";
import { Theme } from "@mui/material/styles/createTheme";

function SecondStage({
    theme,
    handleChange,
    handleStages,
}: {
    theme: Theme;
    handleChange(
        attr: keyof Apartment
    ): (event: React.ChangeEvent<HTMLInputElement>) => void;
    handleStages: (event: React.FormEvent) => void;
}) {
    const apartment = useApartment();
    
    return <div>SecondStage</div>;
}

export default SecondStage;
