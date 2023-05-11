import React from "react";
import { LoadingButton } from "@mui/lab";
import {
  Divider,
  Modal,
  Box,
  Typography,
  TextField,
  InputAdornment,
  CircularProgress,
} from "@mui/material";
import { FormValues } from "./AuthModal";
import { registerSuite } from "../../utils/suites/registerSuite";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

interface RegisterModalProps {
  open: boolean;
  onClose: () => void;
  style: object;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  handleSubmission: (
    event: React.FormEvent,
    submissionFormValues: FormValues,
    type: "login" | "register"
  ) => Promise<void>;
  registerFormValues: FormValues;
  setRegisterFormValues: React.Dispatch<React.SetStateAction<FormValues>>;
  loading: boolean;
}

function RegisterModal({
  open,
  onClose,
  style,
  loading,
  setLoading,
  handleSubmission,
  registerFormValues,
  setRegisterFormValues,
}: RegisterModalProps) {
  const [formState, setFormState] = React.useState({});
  const [userPending, setUserPending] = React.useState<boolean>(false);
  const [emailPending, setEmailPending] = React.useState<boolean>(false);
  const [visibility, setVisibility] = React.useState<boolean>(false);

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    currentField: string,
    value: string
  ) => {
    setRegisterFormValues({
      ...registerFormValues,
      [currentField]: event.target.value,
    });
    const nextState = { ...formState, [currentField]: value };
    const result = registerSuite(nextState, currentField);
    setFormState(nextState);

    if (currentField === "username") {
      setUserPending(true);
    }

    if (currentField === "email") {
      setEmailPending(true);
    }

    result.done(() => {
      setUserPending(false);
      setEmailPending(false);
    });
  };

  const suiteResult = registerSuite.get();

  return (
    <React.Fragment>
      <Modal
        open={open}
        onClose={() => {
          onClose();
          registerSuite.reset();
        }}
      >
        <Box sx={{ ...style }}>
          <Box>
            <Typography
              sx={{
                pt: 2,
                fontWeight: "500",
              }}
            >
              Register an account
            </Typography>
          </Box>
          <Divider sx={{ width: "100%" }} />
          <Box
            component="form"
            onSubmit={(event) => {
              setLoading(true);
              handleSubmission(event, registerFormValues, "register");
            }}
            sx={{
              width: { xs: "90%", sm: "95%" },
              display: "flex",
              flexDirection: "column",
              py: 2,
            }}
          >
            <Typography sx={{ marginBottom: "1em", fontWeight: "500" }}>
              Welcome to Homey! You're just a step away from joining us.
            </Typography>
            <TextField
              color={suiteResult.isValid("first_name") ? "success" : "error"}
              placeholder="First Name"
              error={suiteResult.hasErrors("first_name") ? true : false}
              helperText={suiteResult.getErrors("first_name")[0]}
              type="text"
              value={registerFormValues.first_name}
              onChange={(event) =>
                handleChange(event, "first_name", event.target.value)
              }
              id="first_name"
              sx={{ marginBottom: "1em" }}
            />
            <TextField
              color={suiteResult.isValid("last_name") ? "success" : "error"}
              placeholder="Last Name"
              error={suiteResult.hasErrors("last_name") ? true : false}
              helperText={suiteResult.getErrors("last_name")[0]}
              type="text"
              value={registerFormValues.last_name}
              onChange={(event) =>
                handleChange(event, "last_name", event.target.value)
              }
              id="last_name"
              sx={{ marginBottom: "1em" }}
            />
            <TextField
              InputProps={
                emailPending
                  ? {
                      endAdornment: (
                        <InputAdornment position="end">
                          <CircularProgress size={20} />
                        </InputAdornment>
                      ),
                    }
                  : {}
              }
              color={suiteResult.isValid("email") ? "success" : "error"}
              placeholder="Email Address"
              error={suiteResult.hasErrors("email") ? true : false}
              helperText={suiteResult.getErrors("email")[0]}
              type="text"
              value={registerFormValues.email}
              onChange={(event) => {
                setRegisterFormValues({
                  ...registerFormValues,
                  email: event.target.value,
                });
              }}
              onBlur={(event) => {
                event.target.value && setEmailPending(true);
                handleChange(event, "email", event.target.value);
              }}
              id="email"
              sx={{ marginBottom: "1em" }}
            />
            <TextField
              InputProps={
                userPending
                  ? {
                      endAdornment: (
                        <InputAdornment position="end">
                          <CircularProgress size={20} />
                        </InputAdornment>
                      ),
                    }
                  : {}
              }
              color={suiteResult.isValid("username") ? "success" : "error"}
              placeholder="Username"
              error={suiteResult.hasErrors("username") ? true : false}
              helperText={suiteResult.getErrors("username")[0]}
              type="text"
              value={registerFormValues.username}
              onChange={(event) => {
                setRegisterFormValues({
                  ...registerFormValues,
                  username: event.target.value,
                });
              }}
              onBlur={(event) => {
                event.target.value && setUserPending(true);
                handleChange(event, "username", event.target.value);
              }}
              id="username"
              sx={{ marginBottom: "1em" }}
            />
            <TextField
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <Box
                      component="button"
                      type="button"
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        backgroundColor: "transparent",
                        border: "none",
                      }}
                      onClick={() => setVisibility(!visibility)}
                    >
                      {visibility ? (
                        <VisibilityOffIcon color="primary" />
                      ) : (
                        <VisibilityIcon color="primary" />
                      )}
                    </Box>
                  </InputAdornment>
                ),
              }}
              color={suiteResult.isValid("password") ? "success" : "error"}
              placeholder="Password"
              error={suiteResult.hasErrors("password") ? true : false}
              helperText={suiteResult.getErrors("password")[0]}
              type={visibility ? "text" : "password"}
              value={registerFormValues.password}
              onChange={(event) =>
                handleChange(event, "password", event.target.value)
              }
              id="password"
              sx={{ marginBottom: "1em" }}
            />
            <TextField
              color={
                registerFormValues.confirm_password &&
                suiteResult.isValid("confirm_password")
                  ? "success"
                  : "error"
              }
              placeholder="Confirm Password"
              error={suiteResult.hasErrors("confirm_password") ? true : false}
              helperText={suiteResult.getErrors("confirm_password")[0]}
              type={visibility ? "text" : "password"}
              value={registerFormValues.confirm_password}
              onChange={(event) =>
                handleChange(event, "confirm_password", event.target.value)
              }
              id="confirm_password"
              sx={{ marginBottom: "1em" }}
            />
            <LoadingButton
              disabled={
                Object.values(registerFormValues).some(
                  (value) => value === ""
                ) || !suiteResult.isValid()
              }
              loading={loading}
              type="submit"
            >
              Register
            </LoadingButton>
          </Box>
        </Box>
      </Modal>
    </React.Fragment>
  );
}

export default RegisterModal;
