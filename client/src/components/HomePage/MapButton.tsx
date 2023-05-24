import { Button, Chip, useTheme } from "@mui/material";
import React from "react";
import MapIcon from "@mui/icons-material/Map";
import {
  LISTING_ACTIONS,
  useListing,
  useListingDispatch,
} from "../../context/ListingContext";

const MapButton = () => {
  const theme = useTheme();
  const mapContext = useListing();
  const mapDispatch = useListingDispatch();

  const handleMapDisplay = () => {
    mapDispatch({
      type: LISTING_ACTIONS.MAP_STATUS,
      payload: { mapActive: !mapContext.mapActive },
    });
  };

  return (
    <Chip
      icon={<MapIcon />}
      sx={{
        zIndex: "4",
        position: "sticky",
        bottom: "5px",
        left: "50%",
        transform: "translateX(-50%)",
        backgroundColor: theme.palette.background.default,
        paddingX: "5px",
        "&&:hover": {
          backgroundColor: theme.palette.background.default,
        },
      }}
      label={mapContext.mapActive ? "Hide Map" : "Show Map"}
      clickable
      variant="outlined"
      onClick={() => handleMapDisplay()}
    />
  );
};

export default MapButton;
