import { Box, Container, Grid } from "@mui/material";
import React from "react";
import ListingFeedCard, { FeedListingProps } from "./ListingFeedCard";
import Map from "./Map/Map";
import axios from "axios";

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
          // Maps display
          display: { xs: "none", xl: "block" },
          position: { xl: "sticky" },
          top: "0",
          width: { xl: "40%" },
          height: { xl: "100vh" },
        }}
      >
        <Map listings={listings} />
      </Container>
    </Box>
  );
};

export default ListingsFeedContainer;
