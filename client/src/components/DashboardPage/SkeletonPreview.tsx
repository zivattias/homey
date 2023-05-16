import { Box, Skeleton } from "@mui/material";
import React from "react";

export const SkeletonPreview = () => {
  return (
    <Box
      sx={{
        my: 2,
        px: { sm: 2 },
        width: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "left",
      }}
    >
      <Skeleton
        sx={{ borderRadius: "5px" }}
        variant="rectangular"
        width="100%"
        height={200}
      />
      <Skeleton height={60} />
      <Skeleton width="60%" />
    </Box>
  );
};
