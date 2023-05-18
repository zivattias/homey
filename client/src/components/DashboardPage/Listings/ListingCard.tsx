import {
  Card,
  CardContent,
  Typography,
  Chip,
  Divider,
  CardActions,
  Button,
  Box,
} from "@mui/material";
import React from "react";
import { ListingProps } from "./ListingsContainer";
import DeleteModal from "./DeleteModal";
import { FavoriteOutlined } from "@mui/icons-material";

const ListingCard = ({
  listing,
  setIsListingModified,
}: {
  listing: ListingProps;
  setIsListingModified: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [deleteModal, setDeleteModal] = React.useState<boolean>(false);
  console.log(listing);
  return (
    <>
      <Card
        sx={{
          maxWidth: "100%",
        }}
      >
        <CardContent>
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "row", sm: "column", md: "row" },
              width: "100%",
              justifyContent: "space-between",
            }}
          >
            <Box>
              <Typography gutterBottom variant="h6" component="div">
                {`${listing.title}`}
              </Typography>
              <Typography gutterBottom variant="body1" component="div">
                {`${listing.description}`}
              </Typography>
            </Box>
            <Chip
              sx={{
                width: "4em",
                mb: "1em",
                fontSize: "10px",
                fontWeight: "bold",
              }}
              label={`${listing.id}`}
              variant="outlined"
            />
          </Box>
          <Divider sx={{ mb: 2, mt: 1 }}></Divider>
          <Typography mb="0.7em" variant="body2">
            <span style={{ fontWeight: "bold" }}>Apartment ID:</span>{" "}
            {listing.apt}
          </Typography>
          <Typography mb="0.7em" variant="body2">
            <span style={{ fontWeight: "bold" }}>Created at:</span>{" "}
            {new Date(listing.created).toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </Typography>
          <Typography mb="0.7em" variant="body2">
            <span style={{ fontWeight: "bold" }}>Start date:</span>{" "}
            {`${new Date(listing.from_date).toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            })}`}
          </Typography>
          <Typography mb="0.7em" variant="body2">
            <span style={{ fontWeight: "bold" }}>End date:</span>{" "}
            {`${new Date(listing.to_date).toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            })}`}
          </Typography>
          <Typography mb="0.7em" variant="body2">
            <span style={{ fontWeight: "bold" }}>Duration:</span>{" "}
            {`${listing.duration} day${listing.duration > 1 ? "s" : ""}`}
          </Typography>
        </CardContent>
        <CardActions sx={{ p: 2 }}>
          <Button
            sx={{ mr: 2 }}
            variant="contained"
            color="error"
            onClick={() => setDeleteModal(!deleteModal)}
            size="small"
          >
            Delete
          </Button>
          <Chip
            icon={<FavoriteOutlined fontSize="small" color="error" />}
            label={`Likes: ${
              listing.liked_by_users.length > 0
                ? listing.liked_by_users.length
                : "0"
            }`}
            variant="outlined"
          />
        </CardActions>
      </Card>
      <DeleteModal
        setIsListingModified={setIsListingModified}
        modalState={deleteModal}
        toggleModalState={setDeleteModal}
        listingId={listing.id}
      />
    </>
  );
};

export default ListingCard;
