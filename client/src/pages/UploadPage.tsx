import React from "react";
import { useUser } from "../context/UserContext";
import { useTheme } from "@mui/material";
import { Navigate } from "react-router-dom";
import {
    ADD_APARTMENT_ACTIONS,
    Apartment,
    useApartment,
    useApartmentDispatch,
} from "../context/ApartmentContext";
import FirstStage from "../components/UploadPage/FirstStage";
import SecondStage from "../components/UploadPage/SecondStage";

function UploadPage() {
    const theme = useTheme();
    const user = useUser();
    const dispatch = useApartmentDispatch();
    const [isSecondStage, setIsSecondStage] = React.useState<boolean>(false);

    const handleStages = (event: React.FormEvent) => {
        event.preventDefault();
        isSecondStage ? setIsSecondStage(false) : setIsSecondStage(true);
    };

    function handleChange(attr: keyof Apartment) {
        return (event: React.ChangeEvent<HTMLInputElement>) => {
            let value: any = event.target.value;
            if (["streetNum", "aptNum", "squareMeter"].includes(attr)) {
                value = parseInt(value);
            }
            dispatch({
                type: ADD_APARTMENT_ACTIONS.CHANGE_ATTR,
                payload: { [attr]: value },
            });
        };
    }

    return !user.accessToken ? (
        <Navigate to="/" />
    ) : isSecondStage ? (
        <SecondStage
            theme={theme}
            handleStages={handleStages}
        />
    ) : (
        <FirstStage
            theme={theme}
            handleChange={handleChange}
            handleStages={handleStages}
        />
    );
}

export default UploadPage;
