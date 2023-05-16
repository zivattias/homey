import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { ApartmentProps } from "./ApartmentCard";
import { useAlert } from "react-alert";
import sendRequest from "../../../utils/funcs/sendRequest";
import { API_ENDPOINTS, FULL_API_ENDPOINT } from "../../../utils/consts";
import { useUser } from "../../../context/UserContext";
import { LoadingButton } from "@mui/lab";

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

type DeleteModalProps = {
  toggleModalState: () => void;
  modalState: boolean;
  apartmentId: number;
  setUserApartments: React.Dispatch<React.SetStateAction<ApartmentProps[]>>;
};

const DeleteModal = ({
  toggleModalState,
  modalState,
  apartmentId,
  setUserApartments,
}: DeleteModalProps) => {
  const alert = useAlert();
  const user = useUser();
  const [loading, setLoading] = React.useState<boolean>(false);
  const handleDelete = async () => {
    setLoading(true);
    try {
      const response = await sendRequest(
        "delete",
        FULL_API_ENDPOINT + API_ENDPOINTS.APARTMENTS.BASE + `${apartmentId}/`,
        user.accessToken!,
        {}
      );
      if (response.status == 204) {
        setUserApartments((prevApartments) =>
          prevApartments.filter((apartment) => apartment.id !== apartmentId)
        );
        alert.show(`Deleted apartment ${apartmentId}`, { type: "info" });
        setLoading(false);
        toggleModalState();
      }
    } catch (error: any) {
      alert.show("Failed to delete apartment", { type: "error" });
      setLoading(false);
      toggleModalState();
    }
  };

  return (
    <Modal
      open={modalState}
      onClose={toggleModalState}
      aria-labelledby="delete-modal-title"
      aria-describedby="delete-modal-description"
    >
      <Box sx={style}>
        <Typography id="delete-modal-title" variant="h6" component="h2">
          {`Are you sure you want to delete apartment #${apartmentId}?`}
        </Typography>
        <Typography id="delete-modal-description" sx={{ my: 2 }}>
          The apartment will be deleted from your account and dashboard.
        </Typography>
        <LoadingButton
          color="error"
          loading={loading}
          onClick={handleDelete}
          variant="contained"
          sx={{ mr: 2 }}
        >
          Delete
        </LoadingButton>
        <Button variant="outlined" onClick={toggleModalState}>
          Back
        </Button>
      </Box>
    </Modal>
  );
};

export default DeleteModal;
