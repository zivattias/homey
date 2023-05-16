import React from "react";
import { useUser } from "../context/UserContext";
import { Box, Container, Typography, useTheme } from "@mui/material";
import Lottie from "lottie-react";
import confettiAnim from "../assets/lotties/confetti.json";
import { Link, Navigate, useNavigate } from "react-router-dom";
import {
  ADD_APARTMENT_ACTIONS,
  Apartment,
  useApartmentDispatch,
} from "../context/ApartmentContext";
import FirstStage from "../components/UploadPage/FirstStage";
import ThirdStage from "../components/UploadPage/ThirdStage";
import ProgressBar from "../components/UploadPage/ProgressBar";
import SecondStage from "../components/UploadPage/SecondStage";
import { ImageProvider } from "../context/ApartmentImageContext";
import FourthStage from "../components/UploadPage/FourthStage";

function UploadPage() {
  const navigate = useNavigate();
  const theme = useTheme();
  const user = useUser();
  const dispatch = useApartmentDispatch();
  const totalStages = 4;
  const [atStage, setAtStage] = React.useState<number>(1);
  const [progressBarValue, setProgressBarValue] = React.useState<number>(0);
  const [apartmentFinalized, setApartmentFinalized] =
    React.useState<boolean>(false);

  React.useEffect(() => {
    if (atStage == 1) {
      setProgressBarValue(100 / totalStages);
    } else {
      setProgressBarValue((atStage / totalStages) * 100);
    }
  }, [atStage]);

  const handleStages = (event: React.FormEvent, whereTo: number) => {
    event.preventDefault();
    setAtStage((stage) => stage + whereTo);
  };

  const stagesMap: { [key: number]: JSX.Element } = {
    1: (
      <FirstStage
        theme={theme}
        handleChange={handleChange}
        handleStages={handleStages}
      />
    ),
    2: <SecondStage theme={theme} handleStages={handleStages} />,
    3: <ThirdStage theme={theme} handleStages={handleStages} />,
    4: (
      <FourthStage
        theme={theme}
        handleStages={handleStages}
        finalizeApartment={setApartmentFinalized}
      />
    ),
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
    <ImageProvider>
      <Box
        sx={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {!apartmentFinalized ? (
          <>
            <ProgressBar value={progressBarValue} />
            {stagesMap[atStage]}
          </>
        ) : (
          <>
            <Box
              component="div"
              sx={{
                pointerEvents: "none",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                position: "absolute",
              }}
            >
              <Lottie
                animationData={confettiAnim}
                loop={false}
                onComplete={() => navigate("/dashboard")}
              ></Lottie>
            </Box>
            <Container
              sx={{
                height: "90vh",
                width: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Typography
                sx={{ marginBottom: 2 }}
                variant="h4"
                textAlign="center"
              >
                Redirecting you to{" "}
                <span
                  style={{
                    fontWeight: "700",
                    backgroundImage: `linear-gradient(275deg, #6fcbb6, #9c64f4 100%)`,
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  Dashboard
                </span>{" "}
                in 5 seconds to see your uploaded apartment!
              </Typography>
              <Typography fontWeight="400" variant="h6" textAlign="center">
                <Link
                  style={{
                    fontWeight: "700",
                    backgroundImage: `linear-gradient(275deg, #6fcbb6, #9c64f4 100%)`,
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                  to="/dashboard"
                >
                  Click here
                </Link>{" "}
                if you were not redirected
              </Typography>
            </Container>
          </>
        )}
      </Box>
    </ImageProvider>
  );
}

export default UploadPage;
