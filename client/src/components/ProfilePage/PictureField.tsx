import { LoadingButton } from "@mui/lab";
import { Box } from "@mui/material";
import React from "react";
// import AWS from "aws-sdk";
import { v4 as uuid4 } from "uuid";
import { useAlert } from "react-alert";

function PictureField() {
  const [imageFile, setImageFile] = React.useState<File>();
  const alert = useAlert();
  const handlePhotoUpload = async (event: React.FormEvent) => {
    event.preventDefault();
    const uuid = uuid4();

    // AWS.config.update({
    //   credentials: {
    //     accessKeyId: 
    //     secretAccessKey: 
    //   },
    //   region: ,
    // });
    // const s3 = new AWS.S3();

    // const fileName = `profile_photos/${uuid}.${imageFile?.type.split("/")[1]}`;

    // const s3Object = {
    //   Bucket: "homey-bucket-public",
    //   Key: fileName,
    //   Body: imageFile,
    //   ContentType: imageFile?.type,
    //   ACL: "public-read",
    // };

    // try {
    //   await s3.upload(s3Object).promise();
    //   alert.show("Image uploaded successfully!", { type: "success" });
    // } catch (e) {
    //   console.error(e);
    //   alert.show("Error uploading the photo!", { type: "error" });
    // }
  };

  return (
    <Box component="form" onSubmit={(event) => handlePhotoUpload(event)}>
      <div className="input-group">
        <div className="custom-file">
          <input
            type="file"
            accept="image/png, image/jpeg, image/jpg"
            size={5000000} // Image size limit: 5MB
            className="custom-file-input"
            onChange={(event) => setImageFile(event.target.files?.[0])}
          />
          <label className="custom-file-label">
            {imageFile?.name ?? "Choose a photo"}
          </label>
        </div>
        <div className="input-group-append">
          <LoadingButton
            sx={{
              borderTopLeftRadius: "0",
              borderBottomLeftRadius: "0",
              boxShadow: "none",
              textTransform: "none",
            }}
            variant="outlined"
            type="submit"
            disabled={!Boolean(imageFile)}
          >
            Upload
          </LoadingButton>
        </div>
      </div>
    </Box>
  );
}

export default PictureField;
