import { Box, Container, Grid } from "@mui/material";
import React from "react";
import ListingFeedCard, { FeedListingProps } from "./ListingFeedCard";
import Map from "./Map/Map";
import { useListing } from "../../context/ListingContext";
import SkeletonContainer from "../DashboardPage/SkeletonContainer";

const ListingsFeedContainer = ({
  listings,
  loading,
}: {
  listings: FeedListingProps[];
  loading: boolean;
}) => {
  const mapContext = useListing();

  if (loading) return <SkeletonContainer />;

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column-reverse", lg: "row" },
      }}
    >
      <Grid px={2} container sx={{ width: { lg: "60%" } }}>
        {listings.map((listing) => {
          return (
            <Grid key={listing.id} p={2} item xs={12} md={6} lg={6} xl={4}>
              <ListingFeedCard listing={listing} key={listing.id} />
            </Grid>
          );
        })}
      </Grid>
      <Container
        sx={{
          // Map container
          zIndex: 3,
          position: { xs: "fixed", lg: "sticky" },
          top: "0",
          px: { xs: 0, lg: 2 },
          minWidth: { xs: "100%", lg: "" },
          width: { xs: "100%", lg: "40%" },
          height: { xs: mapContext.mapActive ? "100vh" : "0", lg: "100vh" },
        }}
      >
        <Map listings={listings} />
      </Container>
    </Box>
  );
};

export default ListingsFeedContainer;
