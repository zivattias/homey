import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { useAlert } from "react-alert";
import sendRequest from "../../../utils/funcs/sendRequest";
import { API_ENDPOINTS, FULL_API_ENDPOINT } from "../../../utils/consts";
import { useUser } from "../../../context/UserContext";
import { LoadingButton } from "@mui/lab";
import { TextField } from "@mui/material";

const style = {
  display: "flex",
  flexDirection: "column",
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

type ActivateModalProps = {
  toggleModalState: () => void;
  modalState: boolean;
  apartmentId: number;
  apartmentTitle: string;
  setIsListingModified: React.Dispatch<React.SetStateAction<boolean>>;
};

const ActivateModal = ({
  toggleModalState,
  modalState,
  apartmentId,
  apartmentTitle,
  setIsListingModified,
}: ActivateModalProps) => {
  const alert = useAlert();
  const user = useUser();
  const [loading, setLoading] = React.useState<boolean>(false);

  // Listing input fields: title = apartmentTitle prop, description, price, from_date, to_date
  const [description, setDescription] = React.useState<string>("");
  const [price, setPrice] = React.useState<string>("");
  const [fromDate, setFromDate] = React.useState<string>("");
  const [toDate, setToDate] = React.useState<string>("");

  // Minimum value of toDate = fromDate + 1 day
  const minToDate = fromDate
    ? new Date(new Date(fromDate).getTime() + 86400000)
        .toISOString()
        .split("T")[0]
    : "";

  const handleActivation = async () => {
    setLoading(true);
    try {
      const response = await sendRequest(
        "post",
        FULL_API_ENDPOINT + API_ENDPOINTS.LISTINGS,
        user.accessToken!,
        {
          apt: String(apartmentId),
          title: apartmentTitle,
          description,
          price,
          from_date: fromDate,
          to_date: toDate,
        }
      );

      if (response.status == 201) {
        alert.show("Created listing", { type: "success" });
        setIsListingModified(true);
      } else {
        alert.show("Failed to create listing", { type: "error" });
      }
      setLoading(false);
    } catch (error: any) {
      alert.show(`Failed activating apartment ${apartmentId}`, {
        type: "error",
      });
      setLoading(false);
    } finally {
      toggleModalState();
    }
  };

  return (
    <Modal
      open={modalState}
      onClose={toggleModalState}
      aria-labelledby="activate-modal-title"
      aria-describedby="activate-modal-description"
    >
      <Box sx={style}>
        <Typography id="activate-modal-title" variant="h6" component="h2">
          {`Apartment #${apartmentId} will be publicly available.`}
        </Typography>
        <Typography id="activate-modal-description" sx={{ my: 2 }}>
          Fill out the details to activate your apartment.
        </Typography>
        <TextField
          multiline
          rows={3}
          label="Description"
          // error={suiteResult.hasErrors("username") ? true : false}
          // helperText={suiteResult.getErrors("username")}
          id="description"
          sx={{ marginBottom: "1em" }}
          type="text"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
        />
        <TextField
          label="From date"
          // error={suiteResult.hasErrors("username") ? true : false}
          // helperText={suiteResult.getErrors("username")}
          id="from_date"
          InputLabelProps={{ shrink: true }}
          inputProps={{ min: new Date().toISOString().split("T")[0] }}
          sx={{ marginBottom: "1em" }}
          type="date"
          value={fromDate.split("T")[0]}
          onChange={(event) =>
            setFromDate(new Date(event.target.value).toISOString())
          }
        />
        <TextField
          label="To date"
          // error={suiteResult.hasErrors("username") ? true : false}
          // helperText={suiteResult.getErrors("username")}
          id="to_date"
          disabled={!fromDate}
          inputProps={{ min: minToDate }}
          InputLabelProps={{ shrink: true }}
          sx={{ marginBottom: "1em" }}
          type="date"
          value={toDate.split("T")[0]}
          onChange={(event) =>
            setToDate(new Date(event.target.value).toISOString())
          }
        />
        <TextField
          label="Price"
          // error={suiteResult.hasErrors("username") ? true : false}
          // helperText={suiteResult.getErrors("username")}
          id="price"
          sx={{ marginBottom: "1em" }}
          inputProps={{ min: 1, max: 99999 }}
          type="number"
          value={price}
          onChange={(event) => setPrice(event.target.value)}
        />
        <Box>
          <LoadingButton
            onClick={() => handleActivation()}
            loading={loading}
            variant="contained"
            sx={{ mr: 2 }}
          >
            Activate
          </LoadingButton>
          <Button variant="outlined" onClick={toggleModalState}>
            Back
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default ActivateModal;
