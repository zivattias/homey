import React from "react";
import {
  Box,
  Button,
  Container,
  Divider,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { Apartment, useApartment } from "../../context/ApartmentContext";
import { Theme } from "@mui/material/styles/createTheme";

const FirstStage = ({
  theme,
  handleChange,
  handleStages,
}: {
  theme: Theme;
  handleChange(
    attr: keyof Apartment
  ): (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleStages: (event: React.FormEvent, stage: number) => void;
}) => {
  const apartment = useApartment();

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
            Add your apartment in just a few clicks!
          </Typography>
          <Typography>
            Fill out this form to add your apartment to your account. You will
            be able to {""}
            <Tooltip title="* Display your apartment on Homey">
              <Typography
                component="span"
                sx={{
                  display: "inline",
                  fontWeight: "bold",
                }}
              >
                activate*
              </Typography>
            </Tooltip>
            {""} it later in the process.
          </Typography>
          <Box
            component="form"
            sx={{
              display: "flex",
              flexDirection: "column",
            }}
            onSubmit={(event) => handleStages(event, 1)}
          >
            <TextField
              sx={{ width: "100%", mb: "1em" }}
              value={apartment.street}
              onChange={handleChange("street")}
              id="street"
              label="Street Name"
              variant="outlined"
            />
            <TextField
              type="number"
              sx={{ width: "100%", mb: "1em" }}
              value={apartment.streetNum ?? ""}
              onChange={handleChange("streetNum")}
              id="street_num"
              label="Street Number"
              variant="outlined"
            />
            <TextField
              sx={{ width: "100%", mb: "1em" }}
              type="number"
              value={apartment.aptNum ?? ""}
              onChange={handleChange("aptNum")}
              id="apt_num"
              label="Apartment Number"
              variant="outlined"
            />
            <Divider></Divider>
            <TextField
              sx={{ width: "100%", my: "1em" }}
              type="number"
              value={apartment.zipCode}
              onChange={handleChange("zipCode")}
              id="zip_code"
              label="Zip Code"
              variant="outlined"
            />
            <TextField
              sx={{ width: "100%", mb: "1em" }}
              type="number"
              value={apartment.squareMeter ?? ""}
              onChange={handleChange("squareMeter")}
              id="square_meter"
              label="Square Meter"
              variant="outlined"
            />
            <Divider></Divider>
            <Button
              sx={{ marginTop: "1em", mx: "auto", width: "50%" }}
              variant="contained"
              type="submit"
            >
              Next
            </Button>
          </Box>
        </Stack>
      </Box>
    </Container>
  );
};

export default FirstStage;
