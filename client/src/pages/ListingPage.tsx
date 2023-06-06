import {
  Box,
  Container,
  Divider,
  Grid,
  Skeleton,
  Typography,
} from "@mui/material";
import { USER_ACTIONS, useUser, useUserDispatch } from "../context/UserContext";
import React from "react";
import { useParams } from "react-router-dom";
import { FeedListingProps } from "../components/HomePage/ListingFeedCard";
import sendRequest from "../utils/funcs/sendRequest";
import { API_ENDPOINTS, FULL_API_ENDPOINT } from "../utils/consts";
import { useQuery } from "react-query";
import Carousel from "react-material-ui-carousel";
import ApartmentImage from "../components/DashboardPage/Apartments/ApartmentImage";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { useAlert } from "react-alert";
import { AxiosError } from "axios";
import PricingDetails from "../components/ListingPage/PricingDetails";

const likeIconStyles = {
  cursor: "pointer",
  fontSize: "30px",
  transition: "transform 0.3s ease, box-shadow 0.3s ease",
  "&:hover": {
    transform: "translateY(-5px)",
  },
};

const ListingPage = () => {
  const fetchListingData = async (): Promise<FeedListingProps> => {
    const response = await sendRequest(
      "get",
      FULL_API_ENDPOINT + API_ENDPOINTS.LISTINGS.BASE + `${listing_id}`,
      "",
      {}
    );
    console.log(response.data);
    return response.data;
  };
  const alert = useAlert();
  const user = useUser();
  const userDispatch = useUserDispatch();
  const { listing_id } = useParams();
  const { isLoading, error, data } = useQuery(`listingData`, fetchListingData, {
    cacheTime: 0,
  });

  if (isLoading)
    return (
      <>
        <Container>
          <Skeleton variant="text" height="5em" sx={{ marginBottom: 0 }} />
          <Skeleton
            variant="text"
            height="3em"
            width="50%"
            sx={{ marginBottom: "1em" }}
          />
          <Divider sx={{ marginBottom: "1em" }} />
          <Grid
            container
            columnSpacing={2}
            rowSpacing={2}
            justifyContent={"center"}
          >
            <Grid item xs={12} md={6}>
              <Skeleton variant="rounded" height="400px" />
            </Grid>
            <Grid item xs={12} md={4}>
              <Skeleton variant="rounded" height="400px" />
            </Grid>
          </Grid>
        </Container>
      </>
    );

  if (error) return <div>Error</div>;

  const handleLike = async () => {
    const requestMethod = user.likedListings?.includes(data?.id as number)
      ? "delete"
      : "put";
    try {
      const response = await sendRequest(
        requestMethod,
        FULL_API_ENDPOINT + API_ENDPOINTS.LISTINGS.BASE + `${data?.id}/like/`,
        user.accessToken!,
        {}
      );
      if (response.status == 201) {
        userDispatch({
          type: USER_ACTIONS.UPDATE_FIELD,
          payload: {
            likedListings: [...user.likedListings!, data?.id as number],
          },
        });
      } else if (response.status == 204) {
        userDispatch({
          type: USER_ACTIONS.UPDATE_FIELD,
          payload: {
            likedListings: user.likedListings!.filter(
              (listingId) => listingId !== data?.id
            ),
          },
        });
      }
    } catch (error: any) {
      if (error instanceof AxiosError) {
        console.log(error.response?.data);
      }
    }
  };

  return (
    <Container sx={{ paddingY: 3 }}>
      <Box
        sx={{
          marginBottom: 2,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h5" fontWeight="bold">
          {data?.title}
        </Typography>
        {user.id !== data?.user_id &&
          (user.likedListings?.includes(data?.id as number) ? (
            <FavoriteIcon
              fontSize="large"
              color="error"
              sx={{ ...likeIconStyles }}
              onClick={() => handleLike()}
            />
          ) : (
            <FavoriteBorderIcon
              color="error"
              sx={{ ...likeIconStyles }}
              onClick={() => {
                if (!user.accessToken) {
                  alert.show("Please log in first", { type: "info" });
                } else {
                  handleLike();
                }
              }}
            />
          ))}
      </Box>
      <Typography>{data?.description}</Typography>
      <Divider sx={{ width: "100%", my: 2 }}></Divider>
      <Grid
        container
        columnSpacing={2}
        rowSpacing={2}
        justifyContent={"center"}
      >
        <Grid item xs={12} md={6}>
          <Carousel
            autoPlay={false}
            height="400px"
            navButtonsAlwaysVisible={true}
          >
            {data?.photos.map((photo, index) => (
              <ApartmentImage
                photoObj={photo}
                index={index}
                key={index}
                style={{ borderRadius: "15px" }}
              />
            ))}
          </Carousel>
        </Grid>
        <Grid item xs={12} md={4}>
          <PricingDetails listing={data!} />
        </Grid>
      </Grid>
    </Container>
  );
};

export default ListingPage;
