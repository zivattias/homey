import React from "react";
import { useUser } from "../context/UserContext";
import { Box, useTheme } from "@mui/material";
import { Navigate } from "react-router-dom";
import {
  ADD_APARTMENT_ACTIONS,
  Apartment,
  useApartmentDispatch,
} from "../context/ApartmentContext";
import FirstStage from "../components/UploadPage/FirstStage";
import ThirdStage from "../components/UploadPage/ThirdStage";
import ProgressBar from "../components/UploadPage/ProgressBar";
import SecondStage from "../components/UploadPage/SecondStage";

function UploadPage() {
  const theme = useTheme();
  const user = useUser();
  const dispatch = useApartmentDispatch();
  const totalStages = 3;
  const [atStage, setAtStage] = React.useState<number>(1);
  const [progressBarValue, setProgressBarValue] = React.useState<number>(0);

  React.useEffect(() => {
    if (atStage == 1) {
      setProgressBarValue(100 / totalStages);
    } else {
      setProgressBarValue((atStage / totalStages) * 100);
    }
  }, [atStage]);

  const handleStages = (event: React.FormEvent, whereTo: number) => {
    event.preventDefault();
    setAtStage(stage => stage + whereTo)
  };

  const stagesMap: { [key: number]: JSX.Element } = {
    1: (
      <FirstStage
        theme={theme}
        handleChange={handleChange}
        handleStages={handleStages}
      />
    ),
    2: (
      <SecondStage
        theme={theme}
        handleChange={handleChange}
        handleStages={handleStages}
      />
    ),
    3: <ThirdStage theme={theme} handleStages={handleStages} />,
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
        width: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <ProgressBar value={progressBarValue} />
      {stagesMap[atStage]}
    </Box>
  );
}

export default UploadPage;
