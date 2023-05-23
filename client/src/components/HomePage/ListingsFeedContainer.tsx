import { Box, Container, Grid } from "@mui/material";
import React from "react";
import ListingFeedCard, { FeedListingProps } from "./ListingFeedCard";
import Map from "./Map/Map";

const ListingsFeedContainer = ({
  listings,
}: {
  listings: FeedListingProps[];
}) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column-reverse", xl: "row" },
      }}
    >
      <Grid px={2} container sx={{ width: { xl: "60%" } }}>
        {listings.map((listing) => {
          return (
            <Grid key={listing.id} p={2} item xs={12} md={6} lg={4} xl={4}>
              <ListingFeedCard listing={listing} key={listing.id} />
            </Grid>
          );
        })}
      </Grid>
      <Container
        sx={{
          // Map container
          zIndex: 3,
          position: "sticky",
          top: "0",
          px: { xs: 0, xl: 2 },
          margin: "0",
          minWidth: { xs: "100%", xl: "" },
          width: { xs: "100%", xl: "40%" },
          height: { xs: "35vh", xl: "100vh" },
        }}
      >
        <Map listings={listings} />
      </Container>
    </Box>
  );
};

export default ListingsFeedContainer;
