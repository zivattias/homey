import { Box, Typography, useTheme } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import React from "react";
import {
  IMAGE_ACTIONS,
  useImages,
  useImagesDispatch,
} from "../../context/ApartmentImageContext";

interface IImageField {
  image_key: number;
}

const ImageField = ({ image_key }: IImageField) => {
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const theme = useTheme();
  const [isHovered, setIsHovered] = React.useState<boolean>(false);
  const images = useImages();
  const dispatch = useImagesDispatch();

  const handleFileChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const src = event.target?.result as string;
          dispatch({
            type: IMAGE_ACTIONS.ADD_IMAGE,
            payload: { key: image_key, src },
          });
        };
        reader.readAsDataURL(file);
      }
    },
    []
  );

  const handleFileDelete = React.useCallback(() => {
    dispatch({
      type: IMAGE_ACTIONS.REMOVE_IMAGE,
      payload: { key: image_key },
    });
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, []);

  return (
    <>
      <Box
        onClick={() => {
          if (
            !images.find((image) => image.key == image_key) &&
            fileInputRef.current
          ) {
            fileInputRef.current.click();
          }
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        sx={{
          overflow: "hidden",
          position: "relative",
          cursor: !images.find((image) => image.key == image_key)
            ? "pointer"
            : "",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          width: "300px",
          height: "200px",
          border: !images.find((image) => image.key == image_key)
            ? theme.palette.mode === "dark"
              ? `${isHovered ? "1.5px" : "1px"} ${
                  isHovered ? "solid" : "dashed"
                } rgba(256, 256, 256, .4)`
              : `${isHovered ? "1.5px" : "1px"} ${
                  isHovered ? "solid" : "dashed"
                } rgba(0, 0, 0, .4)`
            : "",
          borderRadius: "10px",
        }}
      >
        <input
          accept="image/jpeg, image/jpg, image/png"
          ref={fileInputRef}
          id={`photo-${image_key}`}
          type="file"
          style={{ display: "none" }}
          onChange={(event) => handleFileChange(event)}
        />
        {images.find((image) => image.key == image_key) ? (
          <>
            <Box
              sx={{
                transform: isHovered ? "scale(1.15)" : "none",
                transition: "transform 0.25s",
                padding: "3px",
                bgcolor: `${
                  theme.palette.mode == "dark" ? "#2C3333" : "lightgrey"
                }`,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                position: "absolute",
                top: "10px",
                left: "10px",
                borderRadius: "50%",
              }}
            >
              <DeleteIcon
                sx={{ cursor: "pointer" }}
                onClick={(event) => {
                  event.stopPropagation();
                  handleFileDelete();
                }}
              ></DeleteIcon>
            </Box>
            <img
              src={images.find((image) => image.key == image_key)?.src}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          </>
        ) : (
          <label
            style={{
              cursor: "pointer",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <AddIcon fontSize="large" />
            <Typography>Add Photo</Typography>
          </label>
        )}
      </Box>
    </>
  );
};

export default ImageField;
