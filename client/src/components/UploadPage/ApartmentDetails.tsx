import React from "react";
import { useApartment } from "../../context/ApartmentContext";
import { Box, Typography } from "@mui/material";
import checkboxesData from "./consts";
import { useImages } from "../../context/ApartmentImageContext";

const ApartmentDetails = () => {
  const images = useImages();
  const apartment = useApartment();
  const attributes = Object.entries(apartment)
    .filter(([_, value]) => typeof value === "boolean" && value === true)
    .map(([key]) => key);

  return (
    <>
      <Typography my="1em" fontWeight="bold">
        Apartment details:
      </Typography>
      <ul>
        <li>
          <span style={{ fontWeight: "bold" }}>Street name:</span>{" "}
          {apartment.street}
        </li>
        <li>
          <span style={{ fontWeight: "bold" }}>Street number:</span>{" "}
          {apartment.streetNum}
        </li>
        <li>
          <span style={{ fontWeight: "bold" }}>Apartment number:</span>{" "}
          {apartment.aptNum}
        </li>
        <li>
          <span style={{ fontWeight: "bold" }}>Zip-code:</span>{" "}
          {apartment.zipCode}
        </li>
        <li>
          <span style={{ fontWeight: "bold" }}>Square meter:</span>{" "}
          {apartment.squareMeter}
        </li>
      </ul>
      {attributes.length >= 1 ? (
        <>
          <Typography mb=".5em" fontWeight="bold">
            Attributes:
          </Typography>
          <Box mb=".5em">
            {checkboxesData
              .filter((item) => attributes.includes(item.key))
              .map((item) => item.icon)}
          </Box>
        </>
      ) : null}
      <Typography mb="1.5em" fontWeight="bold">
        {images.length} images will be uploaded.
      </Typography>
    </>
  );
};

export default ApartmentDetails;
