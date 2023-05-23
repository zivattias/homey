import { Box, Skeleton, useTheme } from "@mui/material";
import React from "react";
import { FeedListingProps } from "../ListingFeedCard";
import axios from "axios";
import Marker from "./Marker/Marker";

export type MarkerCoordinates = {
  lng: number;
  lat: number;
};

const Map = ({ listings }: { listings: FeedListingProps[] }) => {
  const mapRef = React.useRef();
  const [map, setMap] = React.useState<google.maps.Map>();
  const BASE_COORDINATES = { lat: 32.0716405, lng: 34.7742197 }; // Tel-Aviv
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
          center: BASE_COORDINATES,
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

  return (
    <>
      {loading && (
        <Skeleton animation="pulse" variant="rounded" sx={{ height: "100%" }} />
      )}
      <Box component="div" sx={{ height: "100%", zIndex: "1" }} ref={mapRef}>
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
