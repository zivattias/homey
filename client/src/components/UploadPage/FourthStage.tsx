import React from "react";
import {
  ADD_APARTMENT_ACTIONS,
  useApartment,
  useApartmentDispatch,
} from "../../context/ApartmentContext";
import { Theme } from "@mui/material/styles/createTheme";
import {
  Box,
  Button,
  Container,
  Divider,
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
import ApartmentDetails from "./ApartmentDetails";
import axios from "axios";
import { useAlert } from "react-alert";

const FourthStage = ({
  theme,
  handleStages,
  finalizeApartment,
}: {
  theme: Theme;
  handleStages: (event: React.FormEvent, stage: number) => void;
  finalizeApartment: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [checkboxes, setCheckboxes] = React.useState([...checkboxesData]);
  const [loading, setLoading] = React.useState<boolean>(false);
  const images = useImages();
  const user = useUser();
  const alert = useAlert();
  const apartment = useApartment();
  const dispatch = useApartmentDispatch();
  const [created, setCreated] = React.useState<boolean>(false);
  const [imagesUploaded, setImagesUploaded] = React.useState<number>(0);

  React.useEffect(() => {
    if (imagesUploaded == images.length) {
      finalizeApartment(true);
      setLoading(false);
      setCreated(true);
      dispatch({
        type: ADD_APARTMENT_ACTIONS.RESET_FORM,
        payload: {},
      });
    }
  }, [imagesUploaded]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    try {
      // Add apartment to DB using backend REST API (const apt_uuid = response.data["uuid"])
      const snakeCaseApartmentAttributes = convertCamelToSnake(apartment);

      const response = await sendRequest(
        "post",
        FULL_API_ENDPOINT + API_ENDPOINTS.APARTMENTS.BASE,
        user.accessToken!,
        { ...snakeCaseApartmentAttributes }
      );

      if (response.status === 201) {
        const apt_uuid = response.data["uuid"];

        // Generate n presignedURLs for n images.
        images.forEach(async (image, index) => {
          const imageBlob = await fetch(image.src).then((response) =>
            response.blob()
          );
          const presignedURL = await sendRequest(
            "post",
            FULL_API_ENDPOINT +
              API_ENDPOINTS.UPLOAD_PIC +
              `apartment_pics/${imageBlob.type.split("/")[1]}/`,
            user.accessToken!,
            {}
          );
          if (presignedURL.data) {
            const { url } = presignedURL.data;
            const { key, AWSAccessKeyId, policy, signature } =
              presignedURL.data.fields;

            const fields = [
              { name: "key", value: key },
              { name: "AWSAccessKeyId", value: AWSAccessKeyId },
              { name: "policy", value: policy },
              { name: "signature", value: signature },
              { name: "file", value: imageBlob, filename: key.split("/")[1] },
            ];

            const formData = new FormData();
            fields.forEach((field) => {
              field.name == "file"
                ? formData.append(field.name, field.value, field.filename)
                : formData.append(field.name, field.value);
            });
            // Upload image to S3 using presignedURL (=url)
            const S3Response = await axios.post(url, formData);
            if (S3Response.status == 204) {
              // Upload apartment photos (uploaded URLs) to DB, for apt_uuid.
              const response = await sendRequest(
                "post",
                FULL_API_ENDPOINT +
                  API_ENDPOINTS.APARTMENTS.BASE +
                  `${apt_uuid}/photos/`,
                user.accessToken!,
                {
                  photo_url: url + key,
                }
              );
              if (response.status == 201) {
                alert.show(`Uploaded image #${index + 1}`, {
                  type: "success",
                });
                setImagesUploaded((number) => number + 1);
              }
            } else {
              console.log(S3Response);
            }
          }
        });
      } else {
        throw new Error("Failed uploading apartment");
      }
    } catch (error: any) {
      console.error(error);
    }
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
            Ta-da! Here are your finalized apartment details:
          </Typography>
          <Box
            component="form"
            sx={{
              display: "flex",
              flexDirection: "column",
            }}
            onSubmit={(event) => {
              setLoading(true);
              handleSubmit(event);
            }}
          >
            <ApartmentDetails />
            <Divider></Divider>
            <LoadingButton
              loading={loading}
              sx={{ my: "1em", mx: "auto", width: { xs: "90%", sm: "50%" } }}
              variant="contained"
              type="submit"
            >
              Submit your Apartment
            </LoadingButton>
            <Button
              sx={{ mx: "auto", width: { xs: "90%", sm: "50%" } }}
              disabled={loading}
              variant="outlined"
              onClick={(event) => handleStages(event, -1)}
            >
              Back
            </Button>
          </Box>
        </Stack>
      </Box>
    </Container>
  );
};

export default FourthStage;
