import React from "react";
import Hero from "../components/Hero";
import { FeedListingProps } from "../components/HomePage/ListingFeedCard";
import { useUser } from "../context/UserContext";
import sendRequest from "../utils/funcs/sendRequest";
import { API_ENDPOINTS, FULL_API_ENDPOINT } from "../utils/consts";
import { useAlert } from "react-alert";
import ListingsFeedContainer from "../components/HomePage/ListingsFeedContainer";
import axios from "axios";
import { ListingProvider } from "../context/ListingContext";
import MapButton from "../components/HomePage/MapButton";
import { useMediaQuery } from "@mui/material";

// Homepage components:
// Hero:
// - Image + overlay: describing the goal
// - Heading - "Find your next home in a matter of minutes."
// - Search component: by neighborhood, zipcode, more(?)

export default function HomePage() {
  const isSmallDevice = useMediaQuery("(max-width: 1199px)");
  const [loading, setLoading] = React.useState<boolean>(true);
  const [listings, setListings] = React.useState<FeedListingProps[]>([]);
  const alert = useAlert();
  console.log(loading);
  const fetchFeedListings = async () => {
    try {
      const response = await axios.get(
        FULL_API_ENDPOINT + API_ENDPOINTS.LISTINGS.BASE
      );
      if (response.status == 200) {
        setListings(response.data);
        setLoading(false);
      }
    } catch (error: any) {
      alert.show("Failed getting listings, please refresh or try later", {
        type: "error",
      });
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchFeedListings();
  }, []);

  return (
    <>
      <Hero></Hero>
      <ListingProvider>
        <ListingsFeedContainer listings={listings} loading={loading} />
        {isSmallDevice && <MapButton />}
      </ListingProvider>
    </>
  );
}
