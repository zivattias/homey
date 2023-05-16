import { Container, Grid } from "@mui/material";
import React from "react";
import ListingFeedCard, { FeedListingProps } from "./ListingFeedCard";

const ListingsFeedContainer = ({
  listings,
}: {
  listings: FeedListingProps[];
}) => {
  return (
    <>
      <Container>
        <Grid container>
          {listings.map((listing) => {
            return (
              <Grid key={listing.id} p={2} item xs={12} sm={6} md={6}>
                <ListingFeedCard listing={listing} key={listing.id} />
              </Grid>
            );
          })}
        </Grid>
      </Container>
    </>
  );
};

export default ListingsFeedContainer;
