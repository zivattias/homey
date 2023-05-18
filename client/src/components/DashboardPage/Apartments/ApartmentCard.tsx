import React from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Carousel from "react-material-ui-carousel";
import sendRequest from "../../../utils/funcs/sendRequest";
import { API_ENDPOINTS, FULL_API_ENDPOINT } from "../../../utils/consts";
import { useUser } from "../../../context/UserContext";
import ApartmentImage from "./ApartmentImage";
import checkboxesData from "../../UploadPage/consts";
import { Box, Chip, Divider } from "@mui/material";
import DeleteModal from "./DeleteModal";
import ActivateModal from "../Apartments/ActivateModal";
import { ListingProps } from "../Listings/ListingsContainer";

export interface ApartmentProps {
  apt_num: number;
  created: string;
  modified: string;
  id: number;
  is_balcony: boolean;
  is_deleted: boolean;
  is_parking: boolean;
  is_wifi: boolean;
  pet_friendly: boolean;
  smoke_friendly: boolean;
  listings: object[];
  reviews: [];
  square_meter: number;
  street: string;
  street_num: number;
  user: number;
  uuid: string;
  zip_code: string;
}

interface ApartmentPhoto {
  photo_url: string;
}

const ApartmentCard = ({
  apartment,
  setUserApartments,
  setIsListingModified,
  setListings,
}: {
  apartment: ApartmentProps;
  setUserApartments: React.Dispatch<React.SetStateAction<ApartmentProps[]>>;
  setIsListingModified: React.Dispatch<React.SetStateAction<boolean>>;
  setListings: React.Dispatch<React.SetStateAction<ListingProps[]>>;
}) => {
  const user = useUser();
  const [photos, setPhotos] = React.useState<ApartmentPhoto[]>([]);
  const [deleteModal, setDeleteModal] = React.useState<boolean>(false);
  const [activateModal, setActivateModal] = React.useState<boolean>(false);
  console.log(apartment);
  const attributes = Object.entries(apartment)
    .filter(([_, value]) => typeof value === "boolean" && value === true)
    .map(([key]) => key);

  const icons = checkboxesData
    .filter((item) => attributes.includes(item.id))
    .map((item) => item.icon);

  const fetchPhotos = async (uuid: string) => {
    try {
      const response = await sendRequest(
        "get",
        FULL_API_ENDPOINT + API_ENDPOINTS.APARTMENTS.BASE + `${uuid}/photos/`,
        user.accessToken!,
        {}
      );
      if (response.status == 200) {
        setPhotos(response.data);
      }
    } catch (error: any) {
      setPhotos([]);
    }
  };

  React.useEffect(() => {
    fetchPhotos(apartment.uuid);
  }, []);
  return (
    <>
      <Card
        sx={{
          maxWidth: "100%",
          minHeight: { sm: "535px", md: "510px" },
          position: "relative",
        }}
      >
        {photos.length >= 1 ? (
          <Carousel
            duration={250}
            height={250}
            autoPlay={false}
            indicators={false}
            navButtonsAlwaysVisible={true}
          >
            {photos.map((photoObj, index) => {
              return (
                <ApartmentImage photoObj={photoObj} key={index} index={index} />
              );
            })}
          </Carousel>
        ) : null}
        <CardContent>
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "row", sm: "column", md: "row" },
              width: "100%",
              justifyContent: "space-between",
            }}
          >
            <Typography gutterBottom variant="h6" component="div">
              {`${apartment.street_num} ${apartment.street}`}
            </Typography>
            <Chip
              sx={{
                width: "4em",
                mb: "0.5em",
                fontSize: "10px",
                fontWeight: "bold",
              }}
              label={`${apartment.id}`}
              variant="outlined"
            />
          </Box>
          <Divider sx={{ mb: 2, mt: 1 }}></Divider>
          <Typography mb="0.7em" variant="body2">
            <span style={{ fontWeight: "bold" }}>Added at:</span>{" "}
            {new Date(apartment.created).toLocaleDateString("en-US", {
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
        </CardContent>
        <CardActions sx={{ p: 2, bottom: "0", position: { sm: "absolute" } }}>
          <Button
            size="small"
            variant="contained"
            onClick={() => setActivateModal(!activateModal)}
          >
            Activate
          </Button>
          <Button
            variant="outlined"
            onClick={() => setDeleteModal(!deleteModal)}
            size="small"
            color="error"
          >
            Delete
          </Button>
        </CardActions>
      </Card>
      <DeleteModal
        setListings={setListings}
        setUserApartments={setUserApartments}
        apartmentId={apartment.id}
        modalState={deleteModal}
        toggleModalState={() => setDeleteModal(!deleteModal)}
      />
      <ActivateModal
        setIsListingModified={setIsListingModified}
        apartmentTitle={`${apartment.street_num} ${apartment.street}`}
        apartmentId={apartment.id}
        modalState={activateModal}
        toggleModalState={() => setActivateModal(!activateModal)}
      />
    </>
  );
};

export default ApartmentCard;
