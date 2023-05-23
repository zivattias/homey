import {
  Avatar,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Divider,
  Typography,
} from "@mui/material";
import React from "react";
import { FeedListingProps } from "../../ListingFeedCard";
import Carousel from "react-material-ui-carousel";
import ApartmentImage from "../../../DashboardPage/Apartments/ApartmentImage";
import { useUser } from "../../../../context/UserContext";

const ListingMarker = ({ listing }: { listing: FeedListingProps }) => {
  const user = useUser();
  return (
    <Box
      sx={{
        width: "300px",
        cursor: "pointer",
        position: "absolute",
        top: "calc(100% + 10px)",
        left: "50%",
        transform: "translateX(-50%)",
      }}
    >
      <Card sx={{ width: "100%" }}>
        <Carousel
          height={150}
          autoPlay={false}
          indicators={true}
          navButtonsAlwaysVisible={true}
        >
          {listing.photos.map((url, index) => {
            return <ApartmentImage photoObj={url} key={index} index={index} />;
          })}
        </Carousel>
        <Divider sx={{ mt: 1 }}></Divider>
        <CardContent>
          <Box>
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
          </Box>
          <Box
            sx={{
              position: "relative",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          ></Box>
        </CardContent>
        <CardActions sx={{ p: 2 }}>
          <Button variant="outlined" color="primary">
            Sublet
          </Button>
        </CardActions>
      </Card>
    </Box>
  );
};

export default ListingMarker;
