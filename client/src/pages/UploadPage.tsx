import React from "react";
import { useUser } from "../context/UserContext";
import { Box, Container, useTheme } from "@mui/material";
import { Navigate } from "react-router-dom";
import {
    ADD_APARTMENT_ACTIONS,
    Apartment,
    useApartmentDispatch,
} from "../context/ApartmentContext";
import FirstStage from "../components/UploadPage/FirstStage";
import SecondStage from "../components/UploadPage/SecondStage";
import ProgressBar from "../components/UploadPage/ProgressBar";

function UploadPage() {
    const theme = useTheme();
    const user = useUser();
    const dispatch = useApartmentDispatch();
    const totalStages = 2;
    const [isSecondStage, setIsSecondStage] = React.useState<boolean>(false);
    const [atStage, setAtStage] = React.useState<number>(totalStages);
    const [progressBarValue, setProgressBarValue] = React.useState<number>(0);

    React.useEffect(() => setProgressBarValue(100 / atStage), [atStage]);

    const handleStages = (event: React.FormEvent) => {
        event.preventDefault();
        isSecondStage
            ? (setIsSecondStage(false), setAtStage(2))
            : (setIsSecondStage(true), setAtStage(1));
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
    ) : (
        <Box
            sx={{
                height: {
                    // 100vh - navBar.height
                    xs: "calc(100vh - 56px)",
                    sm: "calc(100vh - 64px)",
                    md: "calc(100vh - 88px)",
                    lg: "calc(100vh - 88px)",
                },
                width: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            <ProgressBar value={progressBarValue} />
            {isSecondStage ? (
                <SecondStage theme={theme} handleStages={handleStages} />
            ) : (
                <FirstStage
                    theme={theme}
                    handleChange={handleChange}
                    handleStages={handleStages}
                />
            )}
        </Box>
    );
}

export default UploadPage;
