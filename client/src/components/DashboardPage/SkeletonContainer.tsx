import { Container, Grid } from "@mui/material";
import { SkeletonPreview } from "./SkeletonPreview";
import React from "react";

const SkeletonContainer = () => {
  return (
    <Container
      sx={{
        width: "100%",
        display: "flex",
        flexDirection: { xs: "column", sm: "row" },
        justifyContent: "center",
        alignItems: { xs: "center", sm: "left" },
      }}
    >
      <Grid container>
        <Grid p={2} item xs={12} sm={6} md={4}>
          <SkeletonPreview />
        </Grid>
        <Grid p={2} item xs={12} sm={6} md={4}>
          <SkeletonPreview />
        </Grid>
        <Grid p={2} item xs={12} sm={6} md={4}>
          <SkeletonPreview />
        </Grid>
      </Grid>
    </Container>
  );
};

export default SkeletonContainer;
