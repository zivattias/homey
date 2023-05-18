import { Box, Stack, Typography } from "@mui/material";
import { Button } from "@mui/material";
import heroImage from "../assets/hero_img.jpeg";
import React from "react";

export default function Hero() {
  return (
    <React.Fragment>
      <Box height="30em" overflow="hidden" position="relative">
        <Box
          component="img"
          src={heroImage}
          sx={{ height: "30em", width: "100%", objectFit: "cover" }}
        />
        {/* The following box is an overlay for the hero image */}
        <Box
          sx={{
            height: "100%",
            width: "100%",
            top: "0px",
            bottom: "0px",
            position: "absolute",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            padding: "1.5em 2.5em",
          }}
        >
          <Stack
            spacing={3}
            display="flex"
            justifyContent="center"
            alignItems="center"
            height="100%"
            textAlign="center"
          >
            <Typography
              sx={{
                fontWeight: "500",
                fontSize: { xs: "30px", sm: "40px" },
                color: "#fafafa",
                textShadow: "5px 5px 10px rgba(0, 0, 0, 1)",
              }}
            >
              Discover your next housing opportunity in Tel-Aviv.
            </Typography>
            <Typography
              sx={{
                fontSize: { xs: "22px", sm: "32px" },
                color: "#fafafa",
                textShadow: "5px 5px 10px rgba(0, 0, 0, 1)",
              }}
            >
              Search nearby apartments for sublet!
            </Typography>
            {/* <Stack direction="row" spacing="3em">
                            <Button
                                variant="contained"
                                sx={{
                                    textTransform: "uppercase",
                                }}
                            >
                                Rent
                            </Button>
                            <Button
                                variant="contained"
                                sx={{
                                    textTransform: "uppercase",
                                }}
                            >
                                Sublet
                            </Button>
                        </Stack> */}
          </Stack>
        </Box>
      </Box>
    </React.Fragment>
  );
}
