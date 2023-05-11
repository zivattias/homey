import React from "react";
import { LoadingButton } from "@mui/lab";
import {
  Divider,
  Modal,
  Box,
  Typography,
  TextField,
  InputAdornment,
} from "@mui/material";
import { FormValues } from "./AuthModal";
import { loginSuite } from "../../utils/suites/loginSuite";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { GoogleLogin } from "@react-oauth/google";
import { useAlert } from "react-alert";
import { API_ENDPOINTS, FULL_API_ENDPOINT } from "../../utils/consts";
import { useUserDispatch, USER_ACTIONS } from "../../context/UserContext";
import axios from "axios";

interface LoginModalProps {
  open: boolean;
  onClose: () => void;
  style: {};
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  handleSubmission: (
    event: React.FormEvent,
    submissionFormValues: FormValues,
    type: "login" | "register"
  ) => Promise<void>;
  loginFormValues: FormValues;
  setLoginFormValues: React.Dispatch<React.SetStateAction<FormValues>>;
  loading: boolean;
}

function LoginModal({
  open,
  onClose,
  style,
  setLoading,
  handleSubmission,
  loginFormValues,
  setLoginFormValues,
  loading,
}: LoginModalProps) {
  const [formState, setFormState] = React.useState({});
  const [visibility, setVisibility] = React.useState<boolean>(false);

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    currentField: "username" | "password",
    value: string
  ) => {
    setLoginFormValues({
      ...loginFormValues,
      [currentField]: event.target.value,
    });
    const nextState = { ...formState, [currentField]: value };
    loginSuite(nextState, currentField);
    setFormState(nextState);
  };

  const suiteResult = loginSuite.get();
  const alert = useAlert();
  const dispatch = useUserDispatch();

  const handleGoogleLogin = async (token: string) => {
    setLoading(true);
    try {
      const response = await axios.post(
        FULL_API_ENDPOINT +
          API_ENDPOINTS.AUTH.BASE +
          API_ENDPOINTS.AUTH.GOOGLE_OAUTH,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
        }
      );
      switch (response.status) {
        case 200:
        case 201:
          dispatch({
            type: USER_ACTIONS.LOGIN,
            payload: {
              accessToken: response.data.access,
              refreshToken: response.data.refresh,
            },
          });
          alert.show(`Welcome!`, { type: "success" });
          break;
        default:
          alert.show("Oops, an error occurred", { type: "error" });
      }
    } catch (error: any) {
      alert.show(error.response.data.message, { type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <React.Fragment>
      <Modal
        open={open}
        onClose={() => {
          onClose();
          loginSuite.reset();
        }}
      >
        <Box sx={style}>
          <Box>
            <Typography
              sx={{
                pt: 4,
                my: "0em",
                fontWeight: "500",
              }}
            >
              Log in
            </Typography>
          </Box>
          <Divider sx={{ width: "100%", m: 0 }} />
          <Box
            component="form"
            onSubmit={(event) => {
              setLoading(true);
              handleSubmission(event, loginFormValues, "login");
            }}
            sx={{
              width: { xs: "90%", sm: "90%" },
              display: "flex",
              flexDirection: "column",
              py: 2,
            }}
          >
            <Typography sx={{ marginBottom: "1em", fontWeight: "500" }}>
              Welcome to Homey!
            </Typography>
            <TextField
              placeholder="Username"
              error={suiteResult.hasErrors("username") ? true : false}
              helperText={suiteResult.getErrors("username")}
              id="username"
              sx={{ marginBottom: "1em" }}
              type="text"
              value={loginFormValues.username}
              onChange={(event) =>
                handleChange(event, "username", event.target.value)
              }
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
              placeholder="Password"
              error={suiteResult.hasErrors("password") ? true : false}
              helperText={suiteResult.getErrors("password")}
              sx={{ marginBottom: "1em" }}
              id="password"
              type={visibility ? "text" : "password"}
              value={loginFormValues.password}
              onChange={(event) =>
                handleChange(event, "password", event.target.value)
              }
            />
            <LoadingButton
              sx={{ marginBottom: "1em" }}
              disabled={
                loginFormValues.username == "" ||
                loginFormValues.password == "" ||
                !suiteResult.isValid()
              }
              loading={loading}
              type="submit"
            >
              Login
            </LoadingButton>
            <Divider sx={{ width: "100%", mb: "1em" }} />
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Typography marginBottom="1em" variant="body2">
                Sign up and log in with Google
              </Typography>
              <GoogleLogin
                onSuccess={async (credentialResponse) => {
                  handleGoogleLogin(String(credentialResponse.credential));
                }}
                onError={() => {
                  alert.show("Bad authentication", { type: "error" });
                }}
              />
            </Box>
          </Box>
        </Box>
      </Modal>
    </React.Fragment>
  );
}

export default LoginModal;
