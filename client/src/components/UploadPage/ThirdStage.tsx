import React from "react";
import Lottie from "lottie-react";
import confettiAnim from "../../assets/lotties/confetti.json";
import {
  ADD_APARTMENT_ACTIONS,
  useApartment,
  useApartmentDispatch,
} from "../../context/ApartmentContext";
import { Theme } from "@mui/material/styles/createTheme";
import {
  Box,
  Button,
  Checkbox,
  Container,
  Divider,
  FormControlLabel,
  FormGroup,
  Stack,
  Typography,
} from "@mui/material";
import checkboxesData from "./consts";
import sendRequest from "../../utils/funcs/sendRequest";
import { API_ENDPOINTS, FULL_API_ENDPOINT } from "../../utils/consts";
import { useUser } from "../../context/UserContext";
import convertCamelToSnake from "../../utils/funcs/convertCamelToSnake";
import { LoadingButton } from "@mui/lab";
import { useImages } from "../../context/ApartmentImageContext";

function ThirdStage({
  theme,
  handleStages,
}: {
  theme: Theme;
  handleStages: (event: React.FormEvent, stage: number) => void;
}) {
  const [checkboxes, setCheckboxes] = React.useState([...checkboxesData]);
  const [loading, setLoading] = React.useState<boolean>(false);

  const handleCheckboxChange = (index: number) => {
    const updatedCheckboxes = [...checkboxes];
    updatedCheckboxes[index].value = !updatedCheckboxes[index].value;
    setCheckboxes(updatedCheckboxes);

    const updatedAttributes: { [key: string]: boolean } = {};
    updatedCheckboxes.forEach((checkbox) => {
      updatedAttributes[checkbox.key] = checkbox.value;
    });

    dispatch({
      type: ADD_APARTMENT_ACTIONS.CHANGE_ATTR,
      payload: updatedAttributes,
    });
  };
  const images = useImages();
  const user = useUser();
  const apartment = useApartment();
  const dispatch = useApartmentDispatch();
  const [created, setCreated] = React.useState<boolean>(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const snakeCaseApartmentAttributes = convertCamelToSnake(apartment);
    const response = await sendRequest(
      "post",
      FULL_API_ENDPOINT + API_ENDPOINTS.APARTMENTS.BASE,
      user.accessToken!,
      { ...snakeCaseApartmentAttributes }
    );
    if (response.status === 201) {
      dispatch({
        type: ADD_APARTMENT_ACTIONS.RESET_FORM,
        payload: {},
      });
      setCreated(true);
    }
    setLoading(false);

    const updatedCheckboxes = [...checkboxes];
    updatedCheckboxes.forEach((checkbox) => (checkbox.value = false));
    setCheckboxes(updatedCheckboxes);
  };

  return (
    <Container
      sx={{
        px: 6,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: "3em",
      }}
    >
      <Box
        sx={{
          borderRadius: "10px",
          border:
            theme.palette.mode === "dark"
              ? "1px solid rgba(256, 256, 256, .4)"
              : "1px solid rgba(0, 0, 0, .4)",
          p: 3,
        }}
      >
        <Stack gap={2}>
          <Typography component="h1" variant="h5">
            Let's add some extra details.
          </Typography>
          <Typography>
            Check the relevant boxes and make your apartment personal.
          </Typography>
          <Box
            component="form"
            sx={{
              display: "flex",
              flexDirection: "column",
            }}
            onSubmit={(event) => handleStages(event, 1)}
          >
            <FormGroup>
              {checkboxes.map((checkbox, index) => {
                return (
                  <Box
                    key={checkbox.key}
                    component="div"
                    sx={{
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    {checkbox.icon}
                    <FormControlLabel
                      label={checkbox.label}
                      control={
                        <Checkbox
                          id={checkbox.key}
                          checked={apartment[checkbox.key] as boolean}
                          onChange={() => handleCheckboxChange(index)}
                        />
                      }
                    />
                  </Box>
                );
              })}
            </FormGroup>
            <Divider></Divider>
            <Button
              sx={{ my: "1em", mx: "auto", width: "60%" }}
              variant="contained"
              type="submit"
            >
              Review
            </Button>
            <Button
              sx={{ mx: "auto", width: "60%" }}
              disabled={loading}
              variant="outlined"
              onClick={(event) => handleStages(event, -1)}
            >
              Back
            </Button>
            {created && (
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
                  onComplete={() => setCreated(false)}
                ></Lottie>
              </Box>
            )}
          </Box>
        </Stack>
      </Box>
    </Container>
  );
}

export default ThirdStage;
