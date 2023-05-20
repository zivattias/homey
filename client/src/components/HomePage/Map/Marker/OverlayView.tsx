import React, { PropsWithChildren } from "react";
import { createOverlay } from "./Overlay";
import { createPortal } from "react-dom";

type OverlayProps = PropsWithChildren<{
  position: google.maps.LatLng | google.maps.LatLngLiteral;
  pane?: keyof google.maps.MapPanes;
  map: google.maps.Map;
  zIndex?: number;
}>;

const OverlayView = ({
  position,
  pane = "floatPane",
  map,
  zIndex = 99,
  children,
}: OverlayProps) => {
  const container = React.useMemo(() => {
    const div = document.createElement("div");
    div.style.position = "absolute";
    return div;
  }, []);

  const overlay = React.useMemo(() => {
    return createOverlay(container, pane, position);
  }, [container, pane, position]);

  React.useEffect(() => {
    overlay?.setMap(map);
    return () => overlay?.setMap(null);
  }, [map, overlay]);

  React.useEffect(() => {
    container.style.zIndex = `${zIndex}`;
  }, [zIndex, container]);

  return createPortal(children, container);
};

export default OverlayView;
