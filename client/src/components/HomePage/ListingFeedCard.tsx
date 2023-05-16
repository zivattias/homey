import React from "react";
import { ListingProps } from "../DashboardPage/Listings/ListingsContainer";
import {
  Card,
  CardContent,
  Typography,
  Chip,
  Divider,
  CardActions,
  Box,
  Avatar,
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
import { request } from "http";
import { API_ENDPOINTS, FULL_API_ENDPOINT } from "../../utils/consts";
import { AxiosError } from "axios";
import { useAlert } from "react-alert";

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
    liked_by_users: number[];
  };
  photos: string[];
  full_name: string;
  created: string;
  modified: string;
  title: string;
  description: string;
  price: string;
  from_date: string;
  to_date: string;
  duration: number;
  is_active: boolean;
  user_id: number;
  user_photo: string;
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
    listing.apt.liked_by_users.length
  );
  const listingPhotos = listing.photos;
  const attributes = Object.entries(listing.apt)
    .filter(([_, value]) => typeof value === "boolean" && value === true)
    .map(([key]) => key);

  const icons = checkboxesData
    .filter((item) => attributes.includes(item.id))
    .map((item) => item.icon);

  const handleLike = async () => {
    const requestMethod = isLiked ? "delete" : "put";
    try {
      const response = await sendRequest(
        requestMethod,
        FULL_API_ENDPOINT +
          API_ENDPOINTS.APARTMENTS.BASE +
          `${listing.apt.id}/like/`,
        user.accessToken!,
        {}
      );
      if (response.status == 201) {
        dispatch({
          type: USER_ACTIONS.UPDATE_FIELD,
          payload: {
            likedApartments: [...user.likedApartments!, listing.apt.id],
          },
        });
        setIsLiked(!isLiked);
        setTotalLikes((prevLikes) => prevLikes + 1);
      } else if (response.status == 204) {
        dispatch({
          type: USER_ACTIONS.UPDATE_FIELD,
          payload: {
            likedApartments: user.likedApartments!.filter(
              (apartment) => apartment !== listing.apt.id
            ),
          },
        });
        setIsLiked(!isLiked);
        setTotalLikes((prevLikes) => prevLikes - 1);
      }
    } catch (error: any) {
      if (error instanceof AxiosError) {
        console.log(error.response?.data);
      }
    }
  };

  React.useEffect(() => {
    if (user.likedApartments) {
      if (user.likedApartments.includes(listing.apt.id)) {
        setIsLiked(true);
      }
    }
  }, [user.likedApartments]);

  return (
    <Card
      sx={{
        width: "100%",
        minHeight: { sm: "570px", md: "570px" },
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
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            width: "100%",
            justifyContent: "space-between",
          }}
        >
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography pr={2} gutterBottom variant="h6" component="div">
              {`${listing.title} • ${parseInt(
                listing.price
              ).toLocaleString()}₪`}
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
          <Typography>{listing.description}</Typography>
        </Box>
        <Divider sx={{ mb: 2, mt: 1 }}></Divider>
        <Box sx={{ position: "relative" }}>
          <Avatar
            sx={{ position: "absolute", right: "0" }}
            src={listing.user_photo}
          >
            {listing.full_name.split(" ")[0][0]}
          </Avatar>
          <Typography mb="0.7em" variant="body2">
            <span style={{ fontWeight: "bold" }}>Added by:</span>{" "}
            {listing.user_id == user.id ? "You" : listing.full_name}
          </Typography>
          <Typography mb="0.7em" variant="body2">
            <span style={{ fontWeight: "bold" }}>Liked by:</span>{" "}
            {`${totalLikes} user(s)`}
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
              <Typography fontWeight="bold" mb="0.4em" variant="body2">
                Attributes:
              </Typography>
              {icons}
            </>
          )}
        </Box>
      </CardContent>
      <CardActions sx={{ p: 2, bottom: "0", position: { sm: "absolute" } }}>
        {/* <Button
          variant="outlined"
          onClick={() => setDeleteModal(!deleteModal)}
          size="small"
          color="error"
        >
          Delete
        </Button> */}
      </CardActions>
    </Card>
  );
};

export default ListingFeedCard;
