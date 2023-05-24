import {
  Avatar,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Divider,
  Typography,
  useMediaQuery,
} from "@mui/material";
import React from "react";
import { FeedListingProps } from "../../ListingFeedCard";
import Carousel from "react-material-ui-carousel";
import ApartmentImage from "../../../DashboardPage/Apartments/ApartmentImage";
import { useUser } from "../../../../context/UserContext";

const ListingMarker = ({
  listingMarkerRef,
  listing,
  map,
}: {
  listingMarkerRef: React.RefObject<HTMLDivElement>;
  listing: FeedListingProps;
  map: google.maps.Map;
}) => {
  const user = useUser();
  // const [listingPosition, setListingPosition] = React.useState("20px");

  // React.useEffect(() => {
  //   const calculateMapPosition = () => {
  //     const mapHeight = map.getDiv().clientHeight;
  //     const position = mapHeight - 20 + "px";
  //     console.log("position", position);
  //     setListingPosition(position);
  //   };

  //   calculateMapPosition();

  //   window.addEventListener("resize", calculateMapPosition);
  //   return () => {
  //     window.removeEventListener("resize", calculateMapPosition);
  //   };
  // }, []);

  return (
    <Card
      ref={listingMarkerRef}
      sx={{
        display: "flex",
        flexDirection: { xs: "row", xl: "column" },
        width: { xs: "300px", xl: "300px" },
        cursor: "pointer",
        position: "absolute",
        top: "calc(100% + 7px)",
        left: "50%",
        transform: "translateX(-50%)",
        height: { xs: "120px", xl: "auto" },
      }}
      id={`marker-card-${listing.id}`}
    >
      <Carousel
        height={150}
        autoPlay={false}
        indicators={true}
        navButtonsAlwaysVisible={true}
        navButtonsProps={{
          style: {
            width: "20px",
            height: "20px",
          },
        }}
        sx={{
          width: { xs: "200px", xl: "100%" },
          height: { xs: "120px", xl: "100%" },
        }}
      >
        {listing.photos.map((url, index) => {
          return <ApartmentImage photoObj={url} key={index} index={index} />;
        })}
      </Carousel>
      <Divider sx={{ mt: 1 }}></Divider>
      <Box>
        <CardContent>
          <Box sx={{ display: "flex", flexDirection: "column" }}>
            <Typography
              pr={2}
              fontWeight="bold"
              gutterBottom
              variant="body2"
              component="div"
            >
              <Box
                component="span"
                sx={{
                  display: "inline-block",
                  maxWidth: "180px",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  verticalAlign: "top",
                }}
              >
                {listing.title}
              </Box>
            </Typography>
            <Typography gutterBottom variant="body2">
              ₪
              {`${Math.ceil(
                parseInt(listing.price) / listing.duration
              )} per night`}
            </Typography>
            <Typography variant="caption">
              {`${new Date(listing.from_date).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              })} - ${new Date(listing.to_date).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              })}`}
            </Typography>
          </Box>
        </CardContent>
        <CardActions sx={{ p: user.id !== listing.user_id ? 2 : 0 }}>
          {user.id !== listing.user_id && (
            <Button
              sx={{ display: { xs: "none", xl: "block" } }}
              variant="outlined"
              color="primary"
              size="small"
            >
              Sublet
            </Button>
          )}
        </CardActions>
      </Box>
    </Card>
  );
};

export default ListingMarker;
