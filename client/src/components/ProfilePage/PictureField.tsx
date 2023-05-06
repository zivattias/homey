import { LoadingButton } from "@mui/lab";
import { Box, useTheme } from "@mui/material";
import React from "react";
import { useAlert } from "react-alert";
import sendRequest from "../../utils/funcs/sendRequest";
import { API_ENDPOINTS, FULL_API_ENDPOINT } from "../../utils/consts";
import {
  USER_ACTIONS,
  useUser,
  useUserDispatch,
} from "../../context/UserContext";
import axios from "axios";

function PictureField() {
  const [imageFile, setImageFile] = React.useState<Blob | undefined>(undefined);
  const [loading, setLoading] = React.useState<boolean>(false);
  const alert = useAlert();
  const user = useUser();
  const dispatch = useUserDispatch();
  const theme = useTheme();

  const handlePhotoUpload = async (event: React.FormEvent) => {
    setLoading(true);
    event.preventDefault();
    const response = await sendRequest(
      "post",
      FULL_API_ENDPOINT +
        API_ENDPOINTS.PROFILE_PIC +
        `${imageFile!.type.split("/")[1]}/`,
      user.accessToken!,
      {}
    );

    if (response.data) {
      const { url } = response.data;
      const { key, AWSAccessKeyId, policy, signature } = response.data.fields;

      const fields = [
        { name: "key", value: key },
        { name: "AWSAccessKeyId", value: AWSAccessKeyId },
        { name: "policy", value: policy },
        { name: "signature", value: signature },
        { name: "file", value: imageFile!, filename: key.split("/")[1] },
      ];

      const formData = new FormData();

      fields.forEach((field) => {
        field.name == "file"
          ? formData.append(field.name, field.value, field.filename)
          : formData.append(field.name, field.value);
      });

      const S3Response = await axios.post(url, formData);
      if (S3Response.status === 204) {
        const response = await sendRequest(
          "patch",
          FULL_API_ENDPOINT + API_ENDPOINTS.USERS + `${user.id}/profile_pic/`,
          user.accessToken!,
          {
            profile_pic: url + key,
          }
        );
        if (response.status == 200) {
          dispatch({
            type: USER_ACTIONS.UPDATE_FIELD,
            payload: { profilePic: url + key },
          });
          setLoading(false);
          alert.show("Image uplodaded", { type: "success" });
        } else {
          alert.show("Couldn't upload image", { type: "error" });
        }
        setImageFile(undefined);
      }
    } else {
      alert.show("Error connecting to server", { type: "error" });
    }
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
          <label
            style={{
              backgroundColor: theme.palette.mode == "dark" ? "black" : "",
              color: theme.palette.mode == "dark" ? "#fafafa" : "black",
            }}
            className="custom-file-label"
          >
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
            loading={loading}
          >
            Upload
          </LoadingButton>
        </div>
      </div>
    </Box>
  );
}

export default PictureField;
