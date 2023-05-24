import { Box, Skeleton, useTheme } from "@mui/material";
import React from "react";
import { FeedListingProps } from "../ListingFeedCard";
import axios from "axios";
import Marker from "./Marker/Marker";
import { useListing } from "../../../context/ListingContext";

export type MarkerCoordinates = {
  lng: number;
  lat: number;
};

const Map = ({ listings }: { listings: FeedListingProps[] }) => {
  const listingContext = useListing();
  const mapRef = React.useRef();
  const [map, setMap] = React.useState<google.maps.Map>();
  const theme = useTheme();
  const [loading, setLoading] = React.useState<boolean>(true);

  React.useEffect(() => {
    const initMap = async () => {
      const { Map } = (await google.maps.importLibrary(
        "maps"
      )) as google.maps.MapsLibrary;

      setMap(
        new Map(mapRef.current!, {
          zoom: 13,
          center: {
            lat: 32.0716405,
            lng: 34.7742197,
          }, // Tel-Aviv
          disableDefaultUI: true,
          clickableIcons: false,
          mapId:
            theme.palette.mode === "dark"
              ? "3e63237c9d845ea8"
              : "64ea118c893451f0",
          gestureHandling: "greedy",
        })
      );
    };

    setLoading(true);
    initMap();
  }, [theme.palette.mode]);

  React.useEffect(() => {
    if (map) {
      map.addListener("tilesloaded", () => {
        setLoading(false);
      });
    }
  }, [map, listings]);

  React.useEffect(() => {
    if (map && listingContext.location) {
      const { lng, lat } = listingContext.location;
      map.setCenter({ lng, lat });
    }
  }, [listingContext.location]);

  return (
    <>
      {loading && (
        <Skeleton animation="pulse" variant="rounded" sx={{ height: "100%" }} />
      )}
      <Box
        component="div"
        sx={{
          height: "100%",
          width: "100%",
          zIndex: "1",
          margin: 0,
          p: 0,
        }}
        ref={mapRef}
      >
        {listings.map((listing, index) => {
          return (
            <Marker
              listing={listing}
              location={listing.location}
              map={map}
              key={index}
            />
          );
        })}
      </Box>
    </>
  );
};

export default Map;
