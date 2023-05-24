import React from "react";
import { MarkerCoordinates } from "../Map";
import ListingFeedCard, { FeedListingProps } from "../../ListingFeedCard";
import OverlayView from "./OverlayView";
import { Box, Chip, Modal, styled, useTheme } from "@mui/material";
import { bool } from "aws-sdk/clients/signer";
import ListingMarker from "./ListingMarker";
import {
  LISTING_ACTIONS,
  useListing,
  useListingDispatch,
} from "../../../../context/ListingContext";

interface MarkerProps {
  listing: FeedListingProps;
  location: MarkerCoordinates;
  map?: google.maps.Map;
}

const StyledChip = styled(Chip)(({ theme }) => ({
  cursor: "pointer",
  color: "black",
  fontWeight: "bold",
  border: "1px solid rgba(0, 0, 0, 0.2)",
  backgroundColor: theme.palette.mode == "dark" ? "lightgrey" : "white",
  ".MuiChip-root": {
    pointerEvents: "none",
  },
  ":hover": {
    backgroundColor: theme.palette.mode == "dark" ? "white" : "lightgrey",
    transform: "scale(1.05)",
  },
  transition: "all .25s ease",
}));

const Marker = ({ listing, location, map }: MarkerProps) => {
  const theme = useTheme();
  const [isHovered, setIsHovered] = React.useState<boolean>(false);
  const [isClicked, setIsClicked] = React.useState<boolean>(false);
  const markerRef = React.useRef<HTMLDivElement>(null);
  const listingMarkerRef = React.useRef<HTMLDivElement>(null);

  const listingContext = useListing();
  const listingDispatch = useListingDispatch();
  console.log(listingContext);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  React.useEffect(() => {
    const listingFeedCard = document.querySelector(
      `.listing-card-${listing.id}`
    );
    const handleClickOutside = (event: MouseEvent) => {
      if (
        markerRef.current &&
        listingMarkerRef.current &&
        !markerRef.current.contains(event.target as Node) &&
        !listingMarkerRef.current.contains(event.target as Node) &&
        !listingFeedCard?.contains(event.target as Node)
      ) {
        setIsClicked(false);
      }
    };

    document.body.addEventListener("click", handleClickOutside);

    return () => {
      document.body.removeEventListener("click", handleClickOutside);
    };
  }, []);

  React.useEffect(() => {
    setIsClicked(listingContext.id === listing.id);
  }, [listingContext]);

  return (
    <>
      {map && (
        <OverlayView
          position={{
            lat: location.lat,
            lng: location.lng,
          }}
          map={map}
          zIndex={isClicked ? 3 : isHovered ? 2 : 1}
        >
          <StyledChip
            sx={{
              backgroundColor: isClicked ? "lightgrey" : "white",
            }}
            label={
              <span>
                <span style={{ fontSize: "16px" }}>₪</span>
                {`${Math.ceil(parseInt(listing.price) / listing.duration)}`}
              </span>
            }
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onClick={() => setIsClicked(true)}
            ref={markerRef}
          />
          {isClicked && (
            <ListingMarker
              listingMarkerRef={listingMarkerRef}
              listing={listing}
              map={map}
            />
          )}
        </OverlayView>
      )}
    </>
  );
};

export default Marker;
