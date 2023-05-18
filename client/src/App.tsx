import React from "react";
import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import Root from "./pages/Root";
import NotFound from "./pages/NotFound";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { CssBaseline, useMediaQuery } from "@mui/material";
import { USER_ACTIONS, useUser, useUserDispatch } from "./context/UserContext";
import useLocalStorage from "./hooks/useLocalStorage";
import sendRequest from "./utils/funcs/sendRequest";
import { API_ENDPOINTS, FULL_API_ENDPOINT } from "./utils/consts";
import refreshAccessToken from "./utils/funcs/refreshAccessToken";
import UploadPage from "./pages/UploadPage";
import ProfilePage from "./pages/ProfilePage";
import { useAlert } from "react-alert";
import AccountPage from "./pages/AccountPage";
import DashboardPage from "./pages/DashboardPage";
import { PaletteMode } from "@mui/material";

export const ColorModeContext = React.createContext({
  toggleColorMode: () => {},
});

function App() {
  const userTheme = useMediaQuery(`(prefers-color-scheme: dark)`)
    ? "dark"
    : "light";

  React.useEffect(() => {
    (setThemeMode as React.Dispatch<React.SetStateAction<string>>)(userTheme);
  }, [userTheme]);

  const alert = useAlert();
  const dispatch = useUserDispatch();
  const user = useUser();
  const [refreshToken] = useLocalStorage("refreshToken", "");
  const [themeMode, setThemeMode] = useLocalStorage("themeMode", userTheme);

  console.log(user);
  React.useEffect(() => {
    const getAccessToken = async () => {
      try {
        const accessToken = await refreshAccessToken(refreshToken as string);
        if (accessToken) {
          dispatch({
            type: USER_ACTIONS.LOGIN,
            payload: {
              accessToken: accessToken,
              refreshToken: refreshToken as string,
            },
          });
          const response = await sendRequest(
            "get",
            FULL_API_ENDPOINT + API_ENDPOINTS.ME,
            accessToken,
            {}
          );
          if (response) {
            dispatch({
              type: USER_ACTIONS.POPULATE,
              payload: {
                firstName: response.data.first_name,
                lastName: response.data.last_name,
                isStaff: response.data.is_staff,
                profilePic: response.data.profile_pic,
                likedListings: response.data.liked_listings,
                ...response.data,
              },
            });
          }
        }
      } catch (e: any) {
        alert.show("Session expired, please relog!", { type: "info" });
      }
    };
    if (refreshToken) {
      getAccessToken();
    }
  }, []);

  const colorMode = React.useMemo(
    () => ({
      toggleColorMode: () => {
        (setThemeMode as React.Dispatch<React.SetStateAction<string>>)(
          (prevMode) => (prevMode === "light" ? "dark" : "light")
        );
      },
    }),
    []
  );
  const theme = React.useMemo(
    () =>
      createTheme({
        typography: {
          fontFamily: ["Poppins", "Roboto", "system-ui"].join(","),
        },
        palette: {
          mode: themeMode as PaletteMode,
        },
      }),
    [themeMode]
  );

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Routes>
          <Route path="/" element={<Root />}>
            <Route index element={<HomePage />} />
            <Route path="/upload" element={<UploadPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/account" element={<AccountPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
