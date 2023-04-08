import React from "react";
import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import Root from "./pages/Root";
import NotFound from "./pages/NotFound";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { CssBaseline, useMediaQuery } from "@mui/material";
import { ChakraProvider } from "@chakra-ui/react";
import { UserProvider, useUser } from "./context/UserContext";
import useLocalStorage from "./hooks/useLocalStorage";
import sendRequest from "./utils/funcs/sendRequest";
import { API_ENDPOINTS, FULL_API_ENDPOINT } from "./utils/consts";
import refreshAccessToken from "./utils/funcs/refreshAccessToken";

export const ColorModeContext = React.createContext({
    toggleColorMode: () => {},
});

function App() {
    const [refreshToken, setRefreshToken] = useLocalStorage("refreshToken", "");
    const prefersDarkMode = useMediaQuery(`(prefers-color-scheme: dark)`);
    const [mode, setMode] = React.useState<"light" | "dark">(
        prefersDarkMode ? "dark" : "light"
    );
    const colorMode = React.useMemo(
        () => ({
            toggleColorMode: () => {
                setMode((prevMode) =>
                    prevMode === "light" ? "dark" : "light"
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
                    mode,
                },
            }),
        [mode]
    );
    // if (refreshToken) {
    //     const getAccessToken = async () => {
    //         const response = await refreshAccessToken(refreshToken as string)

    //     }
    // }
    return (
        <UserProvider>
            <ChakraProvider>
                <ColorModeContext.Provider value={colorMode}>
                    <ThemeProvider theme={theme}>
                        <CssBaseline />
                        <Routes>
                            <Route path="/" element={<Root />}>
                                <Route index element={<HomePage />} />
                                <Route path="*" element={<NotFound />} />
                            </Route>
                        </Routes>
                    </ThemeProvider>
                </ColorModeContext.Provider>
            </ChakraProvider>
        </UserProvider>
    );
}

export default App;
