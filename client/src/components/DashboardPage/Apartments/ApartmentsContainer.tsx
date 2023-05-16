import React from "react";
import ApartmentCard, { ApartmentProps } from ".././Apartments/ApartmentCard";
import { Container, Grid, Typography } from "@mui/material";
import SkeletonContainer from ".././SkeletonContainer";

const ApartmentsContainer = ({
  loading,
  apartments,
  setApartments,
  setIsListingModified,
}: {
  loading: boolean;
  apartments: ApartmentProps[];
  setApartments: React.Dispatch<React.SetStateAction<ApartmentProps[]>>;
  setIsListingModified: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  if (loading) {
    return <SkeletonContainer />;
  }

  if (apartments.length == 0)
    return (
      <Container sx={{ my: 2 }}>
        <Typography>Looks like you don't have any apartments yet.</Typography>
      </Container>
    );

  return (
    <Container sx={{ p: 2 }}>
      <Typography mt={3} variant="h6" fontWeight={600}>
        {apartments.length} Apartment(s):
      </Typography>
      <Grid container>
        {apartments.map((apartment) => {
          return (
            <Grid key={apartment.uuid} p={2} item xs={12} sm={6} md={6}>
              <ApartmentCard
                setUserApartments={setApartments}
                apartment={apartment}
                key={apartment.uuid}
                setIsListingModified={setIsListingModified}
              />
            </Grid>
          );
        })}
      </Grid>
    </Container>
  );
};

export default ApartmentsContainer;
