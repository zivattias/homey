import React from "react";
import ApartmentCard, { ApartmentProps } from ".././Apartments/ApartmentCard";
import { Container, Divider, Grid, Typography } from "@mui/material";
import SkeletonContainer from ".././SkeletonContainer";
import ListingCard from "./ListingCard";

export interface ListingProps {
  liked_by_users: number[];
  id: number;
  created: string;
  modified: string;
  title: string;
  description: string;
  price: string;
  from_date: string;
  to_date: string;
  duration: number;
  is_active: boolean;
  apt: number;
}

const ListingsContainer = ({
  listings,
  setIsListingModified,
}: {
  loading: boolean;
  listings: ListingProps[];
  setIsListingModified: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  return (
    <>
      <Divider></Divider>
      <Container sx={{ p: 2 }}>
        <Typography mt={3} variant="h6" fontWeight={600}>
          {listings.length} Listing(s):
        </Typography>
        <Grid container>
          {listings.map((listing) => {
            return (
              <Grid key={listing.id} p={2} item xs={12} sm={6} md={6}>
                <ListingCard
                  listing={listing}
                  key={listing.id}
                  setIsListingModified={setIsListingModified}
                />
              </Grid>
            );
          })}
        </Grid>
      </Container>
    </>
  );
};

export default ListingsContainer;
