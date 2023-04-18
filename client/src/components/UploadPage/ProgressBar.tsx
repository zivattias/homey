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
                <Typography variant="body2" color="inherit">
                    {`${Math.round(props.value)}%`}
                </Typography>
            </Box>
            <Box sx={{ width: "20em" }}>
                <LinearProgress
                    variant="determinate"
                    {...props}
                    sx={{ borderRadius: "20px" }}
                />
            </Box>
        </Box>
    );
}
