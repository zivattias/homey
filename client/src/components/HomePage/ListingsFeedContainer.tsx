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
      <Grid px={6} container>
        {listings.map((listing) => {
          return (
            <Grid key={listing.id} p={2} item xs={12} md={6} lg={4} xl={3}>
              <ListingFeedCard listing={listing} key={listing.id} />
            </Grid>
          );
        })}
      </Grid>
    </>
  );
};

export default ListingsFeedContainer;
