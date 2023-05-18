import { LoadingButton } from "@mui/lab";
import { Box, Button, Modal, Typography } from "@mui/material";
import React from "react";
import sendRequest from "../../../utils/funcs/sendRequest";
import { API_ENDPOINTS, FULL_API_ENDPOINT } from "../../../utils/consts";
import { APIGateway } from "aws-sdk";
import { useUser } from "../../../context/UserContext";
import { useAlert } from "react-alert";

type DeleteModalProps = {
  modalState: boolean;
  toggleModalState: React.Dispatch<React.SetStateAction<boolean>>;
  listingId: number;
  setIsListingModified: React.Dispatch<React.SetStateAction<boolean>>;
};

const style = {
  borderRadius: "10px",
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: { xs: 350, sm: 450 },
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
};

const DeleteModal = ({
  modalState,
  toggleModalState,
  listingId,
  setIsListingModified,
}: DeleteModalProps) => {
  const alert = useAlert();
  const { accessToken } = useUser();
  const [loading, setLoading] = React.useState<boolean>(false);

  const handleListingDelete = async () => {
    try {
      setLoading(true);
      const response = await sendRequest(
        "delete",
        FULL_API_ENDPOINT +
          API_ENDPOINTS.LISTINGS.BASE +
          `${listingId}/status/`,
        accessToken!,
        {}
      );
      if (response.status == 200) {
        alert.show(`Listing ${listingId} has been deleted`, {
          type: "success",
        });
        setIsListingModified(true);
        setLoading(false);
      } else {
        alert.show(`Error in deleting listing ${listingId}`, { type: "error" });
        setLoading(false);
      }
    } catch (error: any) {
      console.log(error);
    }
  };

  return (
    <Modal
      open={modalState}
      onClose={() => toggleModalState(!modalState)}
      aria-labelledby="delete-modal-title"
      aria-describedby="delete-modal-description"
    >
      <Box sx={style}>
        <Typography id="delete-modal-title" variant="h6" component="h2">
          {`Are you sure you want to delete listing #${listingId}?`}
        </Typography>
        <Typography id="delete-modal-description" sx={{ my: 2 }}>
          The listing will be deleted from your account and dashboard.
        </Typography>
        <LoadingButton
          color="error"
          loading={loading}
          onClick={() => handleListingDelete()}
          variant="contained"
          sx={{ mr: 2 }}
        >
          Delete
        </LoadingButton>
        <Button
          variant="outlined"
          onClick={() => toggleModalState(!modalState)}
        >
          Back
        </Button>
      </Box>
    </Modal>
  );
};

export default DeleteModal;
