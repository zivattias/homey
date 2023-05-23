import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Divider,
  CardActions,
  Box,
  Avatar,
  Button,
} from "@mui/material";
import Carousel from "react-material-ui-carousel";
import ApartmentImage from "../DashboardPage/Apartments/ApartmentImage";
import checkboxesData from "../UploadPage/consts";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import {
  USER_ACTIONS,
  useUser,
  useUserDispatch,
} from "../../context/UserContext";
import sendRequest from "../../utils/funcs/sendRequest";
import { API_ENDPOINTS, FULL_API_ENDPOINT } from "../../utils/consts";
import { AxiosError } from "axios";
import { useAlert } from "react-alert";
import { MarkerCoordinates } from "./Map/Map";

export interface FeedListingProps {
  id: number;
  apt: {
    id: number;
    apt_num: number;
    zip_code: string;
    square_meter: number;
    pet_friendly: boolean;
    smoke_friendly: boolean;
    is_wifi: boolean;
    is_balcony: boolean;
    is_parking: boolean;
    is_deleted: boolean;
  };
  photos: string[];
  full_name: string;
  user_id: number;
  user_photo: string;
  created: string;
  modified: string;
  title: string;
  description: string;
  price: string;
  from_date: string;
  to_date: string;
  duration: number;
  is_active: boolean;
  liked_by_users: number[];
  location: MarkerCoordinates;
}

const likeIconStyles = {
  cursor: "pointer",
  fontSize: "30px",
  transition: "transform 0.3s ease, box-shadow 0.3s ease",
  "&:hover": {
    transform: "translateY(-5px)",
  },
};

const ListingFeedCard = ({ listing }: { listing: FeedListingProps }) => {
  const user = useUser();
  const dispatch = useUserDispatch();
  const alert = useAlert();

  const [isLiked, setIsLiked] = React.useState<boolean>(false);
  const [totalLikes, setTotalLikes] = React.useState<number>(
    listing.liked_by_users.length
  );
  const listingPhotos = listing.photos;
  const attributes = Object.entries(listing.apt)
    .filter(([_, value]) => typeof value === "boolean" && value === true)
    .map(([key]) => key);

  const icons = checkboxesData
    .filter((item) => attributes.includes(item.id))
    .map((item) => item.icon);

  const handleLike = async () => {
    setTotalLikes((prevLikes) => (isLiked ? prevLikes - 1 : prevLikes + 1));
    setIsLiked(!isLiked);
    const requestMethod = isLiked ? "delete" : "put";
    try {
      const response = await sendRequest(
        requestMethod,
        FULL_API_ENDPOINT + API_ENDPOINTS.LISTINGS.BASE + `${listing.id}/like/`,
        user.accessToken!,
        {}
      );
      if (response.status == 201) {
        dispatch({
          type: USER_ACTIONS.UPDATE_FIELD,
          payload: {
            likedListings: [...user.likedListings!, listing.id],
          },
        });
      } else if (response.status == 204) {
        dispatch({
          type: USER_ACTIONS.UPDATE_FIELD,
          payload: {
            likedListings: user.likedListings!.filter(
              (listingId) => listingId !== listing.id
            ),
          },
        });
      }
    } catch (error: any) {
      if (error instanceof AxiosError) {
        console.log(error.response?.data);
      }
      console.log("Inside catch error ", isLiked, !isLiked);
      setIsLiked(!isLiked);
    }
  };

  React.useEffect(() => {
    if (!user.accessToken) {
      setIsLiked(false);
    }
    if (user.likedListings) {
      if (user.likedListings.includes(listing.id)) {
        setIsLiked(true);
      }
    }
  }, [user.likedListings, user.accessToken]);

  return (
    <Card
      sx={{
        width: "100%",
        minHeight: { xs: "auto", sm: "auto", md: "650px", lg: "725px" },
        position: "relative",
      }}
    >
      <Carousel
        duration={250}
        height={250}
        autoPlay={false}
        indicators={false}
        navButtonsAlwaysVisible={true}
      >
        {listingPhotos.map((url, index) => {
          return <ApartmentImage photoObj={url} key={index} index={index} />;
        })}
      </Carousel>
      <CardContent>
        <Box>
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography pr={2} gutterBottom variant="h6" component="div">
              <Box
                component="span"
                sx={{
                  display: "inline-block",
                  maxWidth: { xl: "180px" },
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  verticalAlign: "top",
                }}
              >
                {listing.title}
              </Box>{" "}
              {`• ₪${parseInt(listing.price).toLocaleString()}`}
            </Typography>
            {user.id !== listing.user_id &&
              (isLiked ? (
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
          <Typography
            height={48}
            sx={{
              textOverflow: "ellipsis",
              display: "-webkit-box !important",
              overflow: "hidden",
              WebkitLineClamp: "2",
              WebkitBoxOrient: "vertical",
              maxWidth: { xl: "300px" },
              whiteSpace: "normal",
              verticalAlign: "top",
            }}
          >
            {listing.description}
          </Typography>
        </Box>
        <Divider sx={{ mb: 2, mt: 1 }}></Divider>
        <Box
          sx={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <Avatar
            sx={{ position: "absolute", right: "0" }}
            src={listing.user_photo}
          >
            {listing.full_name.split(" ")[0][0]}
          </Avatar>
          <Typography mb="0.7em" variant="body2">
            <span style={{ fontWeight: "bold" }}>Duration:</span>{" "}
            {`${listing.duration} day(s)`}
          </Typography>
          <Typography mb="0.7em" variant="body2">
            <span style={{ fontWeight: "bold" }}>From date:</span>{" "}
            {new Date(listing.from_date).toLocaleDateString("en-GB")}
          </Typography>
          <Typography mb="0.7em" variant="body2">
            <span style={{ fontWeight: "bold" }}>To date:</span>{" "}
            {new Date(listing.to_date).toLocaleDateString("en-GB")}
          </Typography>
          <Typography mb="0.7em" variant="body2">
            <span style={{ fontWeight: "bold" }}>Added by:</span>{" "}
            {listing.user_id == user.id ? "You" : listing.full_name}
          </Typography>
          <Typography mb="0.7em" variant="body2">
            <span style={{ fontWeight: "bold" }}>Liked by:</span>{" "}
            {`${totalLikes} ${totalLikes == 1 ? "user" : "users"}`}
          </Typography>
          <Typography mb="0.7em" variant="body2">
            <span style={{ fontWeight: "bold" }}>Added on:</span>{" "}
            {new Date(listing.created).toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </Typography>
          {icons.length >= 1 && (
            <>
              <Box sx={{ mb: { sm: "4em" } }}>
                <Typography fontWeight="bold" mb="0.4em" variant="body2">
                  Attributes:
                </Typography>
                {icons}
              </Box>
            </>
          )}
        </Box>
      </CardContent>
      <CardActions sx={{ p: 2, bottom: "0", position: { sm: "absolute" } }}>
        <Button variant="outlined" color="primary">
          Sublet
        </Button>
      </CardActions>
    </Card>
  );
};

export default ListingFeedCard;
