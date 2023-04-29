import React from "react";
import { useUser } from "../context/UserContext";
import { Navigate } from "react-router-dom";
import {
  Box,
  Container,
  Divider,
  Grid,
  Skeleton,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import ProfileField from "../components/ProfilePage/ProfileField";
import PictureField from "../components/ProfilePage/PictureField";

function ProfilePage() {
  const user = useUser();
  const theme = useTheme();
  return !user.accessToken ? (
    <Navigate to="/" />
  ) : (
    <>
      <Container sx={{ marginY: 5 }}>
        <Typography variant="h5" fontWeight={600}>
          Personal Account Settings
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
          <Grid container>
            <Grid item xs={6} md={6}>
              <Stack gap={2}>
                <Typography variant="h6" fontWeight={600}>
                  Profile Picture
                </Typography>
                <Typography variant="subtitle1">
                  This is your public profile picture.
                </Typography>
                <PictureField />
              </Stack>
            </Grid>
            <Grid
              item
              sx={{ display: "flex", justifyContent: "center" }}
              xs={6}
              md={6}
            >
              <Box
                component="img"
                width={150}
                src={
                  user.profilePic ??
                  "https://homey-bucket-public.s3.amazonaws.com/Portrait_Placeholder.png"
                }
              ></Box>
            </Grid>
          </Grid>
        </Box>
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
              Your Name
            </Typography>
            <Typography variant="subtitle1">
              This is your first and last name shown on the platform.
            </Typography>
            <ProfileField
              label="First Name"
              value={user.firstName ?? "TBA"}
              target="firstName"
            />
            <ProfileField
              label="Last Name"
              value={user.lastName ?? "TBA"}
              target="lastName"
            />
          </Stack>
        </Box>
        <Box
          sx={{
            border: `1px solid rgba(${
              theme.palette.mode == "dark" ? "255, 255, 255" : "0, 0, 0"
            }, 0.2)`,
            p: 2,
            borderRadius: "10px",
          }}
        >
          <Stack gap={2}>
            <Typography variant="h6" fontWeight={600}>
              Your Email Address
            </Typography>
            <Typography variant="subtitle1">
              This is the email address you registered with.
            </Typography>
            <ProfileField label="Email" value={user.email!} target="email" />
          </Stack>
        </Box>
      </Container>
    </>
  );
}

export default ProfilePage;
