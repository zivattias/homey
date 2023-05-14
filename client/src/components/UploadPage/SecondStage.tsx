import React from "react";
import {
  Box,
  Button,
  Container,
  Divider,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import { Theme } from "@mui/material/styles/createTheme";
import ImageField from "./ImageField";
import { useImages } from "../../context/ApartmentImageContext";

const SecondStage = ({
  theme,
  handleStages,
}: {
  theme: Theme;
  handleStages: (event: React.FormEvent, stage: number) => void;
}) => {
  const IMAGE_KEY_LIST = [0, 1, 2, 3, 4];
  const MIN_REQUIRED_IMAGES = 3;
  const images = useImages();

  return (
    <Container
      sx={{
        px: 4,
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
            Let's add some photos to your apartment.
          </Typography>
          <Typography>
            Upload at least {MIN_REQUIRED_IMAGES} photos. Photos are vital for
            the success of your housing listing.
          </Typography>
          <Box
            component="form"
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
            onSubmit={(event) => handleStages(event, 1)}
          >
            <Grid
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
              container
              gap={2}
            >
              {IMAGE_KEY_LIST.map((key) => (
                <ImageField key={key} image_key={key} />
              ))}
            </Grid>
            <Divider sx={{ width: "100%", my: "1em" }}></Divider>
            <Button
              disabled={!(images.length >= MIN_REQUIRED_IMAGES)}
              sx={{ mx: "auto", width: "50%" }}
              variant="contained"
              type="submit"
            >
              Next
            </Button>
            <Button
              sx={{ mx: "auto", width: "50%", marginTop: "1em" }}
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

export default SecondStage;
