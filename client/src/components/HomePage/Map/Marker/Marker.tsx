import React from "react";
import { MarkerCoordinates } from "../Map";
import { FeedListingProps } from "../../ListingFeedCard";
import OverlayView from "./OverlayView";

interface MarkerProps {
  location: MarkerCoordinates;
  map?: google.maps.Map;
}

const Marker = ({ location, map }: MarkerProps) => {
  // const [highlight, setHighlight] = React.useState<boolean>(false);
  return (
    <>
      {map && (
        <OverlayView
          position={{
            lat: location.lat,
            lng: location.lng,
          }}
          map={map}
        >
          <button>TEST</button>
        </OverlayView>
      )}
    </>
  );
};

export default Marker;
