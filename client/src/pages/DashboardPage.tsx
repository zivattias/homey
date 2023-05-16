import React from "react";
import { useUser } from "../context/UserContext";
import { Navigate } from "react-router-dom";
import { Container, Divider, Typography } from "@mui/material";
import ApartmentsContainer from "../components/DashboardPage/Apartments/ApartmentsContainer";
import { ApartmentProps } from "../components/DashboardPage/Apartments/ApartmentCard";
import { FULL_API_ENDPOINT, API_ENDPOINTS } from "../utils/consts";
import sendRequest from "../utils/funcs/sendRequest";
import ListingsContainer, {
  ListingProps,
} from "../components/DashboardPage/Listings/ListingsContainer";

const DashboardPage = () => {
  const { accessToken } = useUser();
  const [apartments, setApartments] = React.useState<ApartmentProps[]>([]);
  const [listings, setListings] = React.useState<ListingProps[]>([]);
  const [isListingModified, setIsListingModified] =
    React.useState<boolean>(false);
  const [loading, setLoading] = React.useState<boolean>(true);

  const fetchApartments = async () => {
    try {
      const response = await sendRequest(
        "get",
        FULL_API_ENDPOINT + API_ENDPOINTS.APARTMENTS.BASE,
        accessToken!,
        {}
      );
      if (response.status == 200) {
        setApartments(response.data);
        setListings(
          response.data.flatMap(
            (apartment: ApartmentProps) => apartment.listings
          )
        );
        setLoading(false);
        setIsListingModified(false);
      }
    } catch (error: any) {
      console.log(error);
      setLoading(false);
      setIsListingModified(false);
    }
  };

  React.useEffect(() => {
    setLoading(true);
    fetchApartments();
  }, [isListingModified]);

  return !accessToken ? (
    <Navigate to="/" />
  ) : (
    <>
      <Container sx={{ marginY: 5 }}>
        <Typography marginBottom={1} variant="h5" fontWeight={600}>
          Dashboard
        </Typography>
        <Typography variant="body1" fontWeight={600}>
          Your uploaded apartments and listings are shown here. To create a
          listing, you can click on{" "}
          <span
            style={{
              fontWeight: "700",
              backgroundImage: `linear-gradient(275deg, #6fcbb6, #9c64f4 100%)`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Activate
          </span>
          ; to delete an apartment, click on{" "}
          <span
            style={{
              fontWeight: "700",
              backgroundImage: `linear-gradient(275deg, #6fcbb6, #9c64f4 100%)`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Delete
          </span>
          .
        </Typography>
      </Container>
      <Divider />
      <ApartmentsContainer
        loading={loading}
        apartments={apartments}
        setApartments={setApartments}
        setIsListingModified={setIsListingModified}
      />
      {listings.length >= 1 && (
        <ListingsContainer
          loading={loading}
          listings={listings}
          setIsListingModified={setIsListingModified}
        />
      )}
    </>
  );
};

export default DashboardPage;
