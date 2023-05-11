import React from "react";
import { useUser } from "../context/UserContext";
import { Navigate } from "react-router-dom";
import {
  Box,
  Container,
  Divider,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import PasswordField from "../components/AccountPage/PasswordField";

const AccountPage = () => {
  const user = useUser();
  const theme = useTheme();

  return !user.accessToken ? (
    <Navigate to="/" />
  ) : (
    <>
      <Container sx={{ marginY: 5 }}>
        <Typography variant="h5" fontWeight={600}>
          Account Settings
        </Typography>
      </Container>
      <Divider />
      <Container sx={{ paddingY: 5 }}>
        <Box
          sx={{
            border: `1px solid rgba(${
              theme.palette.mode == "dark" ? "255, 255, 255" : "0, 0, 0"
            }, 0.2)`,
            p: 2,
            borderRadius: "10px",
            marginBottom: 4,
          }}
        >
          <Stack gap={2}>
            <Typography variant="h6" fontWeight={600}>
              Change your password
            </Typography>
            <Typography variant="subtitle1">
              Please type in your new password and confirm it.
            </Typography>
            <PasswordField />
          </Stack>
        </Box>
      </Container>
    </>
  );
};

export default AccountPage;
