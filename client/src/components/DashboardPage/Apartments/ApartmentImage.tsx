import { Box, CircularProgress } from "@mui/material";
import React from "react";

interface ApartmentPhoto {
  photo_url: string;
}

const ApartmentImage = ({
  photoObj,
  index,
  style = {},
}: {
  photoObj: ApartmentPhoto | string;
  index: number;
  style?: React.CSSProperties;
}) => {
  const [apartmentPicLoading, setApartmentPicLoading] =
    React.useState<boolean>(true);
  const url = typeof photoObj == "string" ? photoObj : photoObj.photo_url;

  return (
    <>
      {apartmentPicLoading && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
          }}
        >
          <CircularProgress />
        </Box>
      )}
      <img
        hidden={apartmentPicLoading}
        src={url}
        style={{
          objectFit: "cover",
          height: "100%",
          width: "100%",
          ...style,
        }}
        key={index}
        onLoad={() => setApartmentPicLoading(false)}
      />
    </>
  );
};

export default ApartmentImage;
