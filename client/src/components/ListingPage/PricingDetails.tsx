import React from "react";
import { FeedListingProps } from "../HomePage/ListingFeedCard";
import { Box, Button, Divider, Typography, useTheme } from "@mui/material";

const PricingDetails = ({ listing }: { listing: FeedListingProps }) => {
  const theme = useTheme();

  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          flexDirection: "column",
          paddingX: "1.5em",
          paddingY: "2em",
          height: "400px",
          width: "100%",
          border: `1px solid rgba(${
            theme.palette.mode == "dark" ? "255, 255, 255" : "0, 0, 0"
          }, 0.2)`,
          borderRadius: "15px",
        }}
      >
        <Box>
          <Box sx={{ width: "100%", p: 0, mb: 1.5 }}>
            <span style={{ fontWeight: "bold", fontSize: "1.5em" }}>
              <span
                style={{
                  lineHeight: "20px",
                }}
              >
                ₪
              </span>
              {Math.ceil(parseInt(listing.price) / listing.duration)}
            </span>{" "}
            {"per night"}
            <Divider sx={{ width: "100%" }}></Divider>
          </Box>
          <Box>
            <Typography mb={1}>
              {new Date(listing.from_date).toLocaleDateString("en-GB")} -{" "}
              {new Date(listing.to_date).toLocaleDateString("en-GB")}
            </Typography>
            <Typography mb={1}>{`${listing.duration} nights`}</Typography>
            <Box
              sx={{
                width: "100%",
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span style={{ fontWeight: "bold" }}>
                <span
                  style={{
                    lineHeight: "20px",
                  }}
                >
                  ₪
                </span>
                {Math.ceil(parseInt(listing.price) / listing.duration)} x{" "}
                {listing.duration} {" nights"}
              </span>
              <span style={{ fontWeight: "bold" }}>₪{listing.price}</span>
            </Box>
          </Box>
        </Box>
        <Button variant="contained">Sublet</Button>
      </Box>
    </>
  );
};

export default PricingDetails;
