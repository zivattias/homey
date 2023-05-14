import React from "react";
import LinearProgress, {
  LinearProgressProps,
} from "@mui/material/LinearProgress";
import { Box, Typography } from "@mui/material";

export default function ProgressBar(
  props: LinearProgressProps & { value: number }
) {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        marginTop: "2em",
        marginBottom: "1em",
        flexDirection: "column",
      }}
    >
      <Box sx={{ marginBottom: 1 }}>
        <Typography fontWeight="bold" variant="body2" color="inherit">
          {`${Math.round(props.value)}%`}
        </Typography>
      </Box>
      <Box sx={{ width: { xs: "50vw", sm: "40vw", md: "25vw" } }}>
        <LinearProgress
          variant="determinate"
          {...props}
          sx={{
            background: "lightgrey",
            borderRadius: "20px",
            ".MuiLinearProgress-bar": {
              background: `linear-gradient(90deg, #6fcbb6 ${
                100 - props.value
              }%, #9c64f4 100%)`,
            },
          }}
        />
      </Box>
    </Box>
  );
}
