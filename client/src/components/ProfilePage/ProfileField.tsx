import React from "react";
import { Box, CircularProgress, Typography, useTheme } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import sendRequest from "../../utils/funcs/sendRequest";
import { API_ENDPOINTS, FULL_API_ENDPOINT } from "../../utils/consts";
import {
  USER_ACTIONS,
  User,
  useUser,
  useUserDispatch,
} from "../../context/UserContext";
import { AxiosError } from "axios";
import { useAlert } from "react-alert";
import toSnakeCase from "../../utils/funcs/toSnakeCase";

export default function ProfileField({
  label,
  value,
  target,
}: {
  label: string;
  value: string;
  target: keyof User;
}) {
  const [fieldValue, setFieldValue] = React.useState(value);
  const [loading, setLoading] = React.useState(false);
  const [emailExistsTest, setEmailExistsTest] = React.useState<null | boolean>(
    null
  );
  const [isEmailExists, setIsEmailExists] = React.useState(false);
  const [isChanged, setIsChanged] = React.useState(false);
  const [isEmailValid, setIsEmailValid] = React.useState<boolean>(true);
  const alert = useAlert();
  const theme = useTheme();
  const user = useUser();
  const dispatch = useUserDispatch();

  React.useEffect(() => {
    if (target == "email" && user.email !== fieldValue) {
      setIsEmailValid(
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/i.test(fieldValue)
      );
    } else {
      setIsEmailValid(true);
    }
  }, [fieldValue]);

  const validateEmail = () => {
    if (target == "email" && user.email != fieldValue && isEmailValid) {
      setIsChanged(false);
      setIsEmailExists(false);
      setEmailExistsTest(true);
      const checkEmail = async () => {
        const response = await sendRequest(
          "get",
          FULL_API_ENDPOINT +
            API_ENDPOINTS.AUTH.EMAIL_EXISTS +
            `?email=${fieldValue}`,
          "",
          {}
        );
        setIsEmailExists(response.data);
        setEmailExistsTest(false);
      };
      checkEmail();
    }
  };

  const updateField = async () => {
    try {
      const response = await sendRequest(
        "patch",
        FULL_API_ENDPOINT + API_ENDPOINTS.USERS + `${user.id}/`,
        user.accessToken!,
        { [toSnakeCase(target)]: fieldValue }
      );
      if (response.status === 200) {
        dispatch({
          type: USER_ACTIONS.UPDATE_FIELD,
          payload: {
            [target]: fieldValue,
          },
        });
        alert.show(`${label} updated successfully!`, { type: "success" });
      }
    } catch (e) {
      if (e instanceof AxiosError) {
        alert.show("Error occurred!", { type: "error" });
      }
    }
    setLoading(false);
  };

  return (
    <>
      <Box
        component="form"
        onSubmit={(event) => {
          event.preventDefault();
          setLoading(true);
          updateField();
        }}
      >
        <Box width={{ xs: "100%", sm: "80%", md: "50%" }}>
          <div className="input-group mb-0">
            <div className="input-group-prepend">
              <span
                style={{
                  backgroundColor:
                    theme.palette.mode == "dark" ? "#141414" : "",
                  color: theme.palette.mode == "dark" ? "#fefefe" : "black",
                }}
                className="input-group-text"
                id={`${label.replaceAll(" ", "-")}`}
              >
                {label}
              </span>
            </div>
            <input
              onBlur={() => validateEmail()}
              style={{
                backgroundColor: theme.palette.mode == "dark" ? "black" : "",
                color: theme.palette.mode == "dark" ? "#fafafa" : "black",
              }}
              type="text"
              className="form-control"
              value={fieldValue}
              onChange={(event) => {
                if (target == "email") {
                  setIsChanged(true);
                }
                setFieldValue(event.target.value);
              }}
            />
            <div className="input-group-append">
              <LoadingButton
                type="submit"
                loading={loading}
                disabled={
                  fieldValue == user[target] ||
                  fieldValue == "" ||
                  !isEmailValid ||
                  (target != "email" && fieldValue.length < 2) ||
                  (target == "email" && isEmailExists) ||
                  (target == "email" && Boolean(emailExistsTest)) ||
                  (target == "email" && isChanged)
                }
                sx={{
                  borderTopLeftRadius: "0",
                  borderBottomLeftRadius: "0",
                  boxShadow: "none",
                  textTransform: "none",
                }}
                variant="outlined"
              >
                Save
              </LoadingButton>
            </div>
          </div>
        </Box>
      </Box>
      {target === "email" ? (
        <>
          {isEmailExists ? (
            <Typography sx={{ color: "#8B0000", fontSize: ".9em" }}>
              This address is taken!
            </Typography>
          ) : emailExistsTest ? (
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <CircularProgress size={11} sx={{ marginRight: "0.5em" }} />
              <Typography sx={{ color: "black", fontSize: ".9em" }}>
                Verifying email...
              </Typography>
            </Box>
          ) : user.email !== fieldValue &&
            emailExistsTest !== null &&
            isEmailValid ? (
            <Typography sx={{ color: "#55A630", fontSize: ".9em" }}>
              Email is available!
            </Typography>
          ) : !isEmailValid ? (
            <Typography sx={{ color: "#8B0000", fontSize: ".9em" }}>
              Email is invalid!
            </Typography>
          ) : (
            ""
          )}
        </>
      ) : (
        ""
      )}
    </>
  );
}
