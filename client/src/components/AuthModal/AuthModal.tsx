import { ModalProps } from "@mui/material";
import { AxiosError } from "axios";
import React from "react";
import {
  USER_ACTIONS,
  useUser,
  useUserDispatch,
} from "../../context/UserContext";
import { API_ENDPOINTS, FULL_API_ENDPOINT } from "../../utils/consts";
import sendRequest from "../../utils/funcs/sendRequest";
import LoginModal from "./LoginModal";
import RegisterModal from "./RegisterModal";
import { useAlert } from "react-alert";

const style = {
  borderRadius: "20px",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  gap: 2,
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: { xs: "85%", sm: "70%", md: "50%", lg: "35%" },
  bgcolor: "background.paper",
  boxShadow: 24,
};

interface AuthModalProps extends ModalProps {
  open: boolean;
  onClose: () => void;
  modalType: string;
}

export interface FormValues {
  username: string;
  password: string;
  confirm_password?: string;
  email?: string;
  first_name?: string;
  last_name?: string;
}

export default function AuthModal({
  open,
  onClose,
  modalType,
}: AuthModalProps) {
  const user = useUser();
  const dispatch = useUserDispatch();
  const [loading, setLoading] = React.useState<boolean>(false);
  const alert = useAlert();
  const getUserData = async () => {
    const userData = await sendRequest(
      "get",
      FULL_API_ENDPOINT + API_ENDPOINTS.ME,
      user.accessToken as string,
      {}
    );
    setLoading(false);
    onClose();
    return userData;
  };

  React.useEffect(() => {
    if (user.accessToken && user.refreshToken) {
      const loadData = async () => {
        const userData = await getUserData();
        dispatch({
          type: USER_ACTIONS.POPULATE,
          payload: {
            firstName: userData.data.first_name,
            lastName: userData.data.last_name,
            isStaff: userData.data.is_staff,
            profilePic: userData.data.profile_pic,
            likedListings: userData.data.liked_listings,
            ...userData.data,
          },
        });
      };
      loadData();
    }
  }, [user.accessToken, user.refreshToken]);

  const [loginFormValues, setLoginFormValues] = React.useState<FormValues>({
    username: "",
    password: "",
  });

  const [registerFormValues, setRegisterFormValues] =
    React.useState<FormValues>({
      username: "",
      password: "",
      confirm_password: "",
      email: "",
      first_name: "",
      last_name: "",
    });

  const handleSubmission = async (
    event: React.FormEvent,
    submissionFormValues: FormValues,
    type: "login" | "register"
  ) => {
    event.preventDefault();
    try {
      if (type === "login") {
        try {
          const response = await sendRequest(
            "post",
            FULL_API_ENDPOINT +
              API_ENDPOINTS.AUTH.BASE +
              API_ENDPOINTS.AUTH.LOGIN,
            "",
            { ...submissionFormValues }
          );
          dispatch({
            type: USER_ACTIONS.LOGIN,
            payload: {
              accessToken: response.data.access,
              refreshToken: response.data.refresh,
            },
          });
          alert.show(`Welcome back, ${loginFormValues.username}`, {
            type: "success",
          });
        } catch (e) {
          if (e instanceof AxiosError) {
            if (e.response!.status === 401) {
              alert.show("Invalid credentials", { type: "error" });
            } else {
              alert.show("Server error occurred", { type: "error" });
            }
          }
        }
      } else {
        const response = await sendRequest(
          "post",
          FULL_API_ENDPOINT +
            API_ENDPOINTS.AUTH.BASE +
            API_ENDPOINTS.AUTH.REGISTER,
          "",
          { ...submissionFormValues }
        );
        if (response.status === 201) {
          dispatch({
            type: USER_ACTIONS.LOGIN,
            payload: {
              accessToken: response.data.access,
              refreshToken: response.data.refresh,
            },
          });
          alert.show(
            `Welcome, ${registerFormValues.first_name} ${registerFormValues.last_name}!`,
            {
              type: "success",
            }
          );
        }
      }
    } catch (e) {
      if (e instanceof AxiosError) {
        alert.show(`${e.message}`, { type: "error" });
      } else {
        alert.show("Oops, an error occurred.", {
          type: "error",
        });
      }
    }
    setLoading(false);
  };

  if (modalType === "Login") {
    return (
      <LoginModal
        open={open}
        onClose={onClose}
        style={style}
        setLoading={setLoading}
        loading={loading}
        handleSubmission={handleSubmission}
        loginFormValues={loginFormValues}
        setLoginFormValues={setLoginFormValues}
      />
    );
  }
  return (
    <RegisterModal
      open={open}
      onClose={onClose}
      style={style}
      setLoading={setLoading}
      loading={loading}
      handleSubmission={handleSubmission}
      registerFormValues={registerFormValues}
      setRegisterFormValues={setRegisterFormValues}
    />
  );
}
