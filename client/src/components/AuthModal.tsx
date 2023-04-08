import {
    Button,
    FormControl,
    Input,
    InputLabel,
    Modal,
    ModalProps,
    Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import { AxiosError, AxiosResponse } from "axios";
import React from "react";
import { USER_ACTIONS, useUser, useUserDispatch } from "../context/UserContext";
import { API_ENDPOINTS, FULL_API_ENDPOINT } from "../utils/consts";
import sendRequest from "../utils/funcs/sendRequest";

const style = {
    position: "absolute" as "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "50%",
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 7,
};

interface AuthModal extends ModalProps {
    open: boolean;
    onClose: () => void;
    modalType: string;
}

export default function AuthModal({ open, onClose, modalType }: AuthModal) {
    const user = useUser();
    console.log(user);
    const dispatch = useUserDispatch();

    const getUserData = async () => {
        const userData = await sendRequest(
            "get",
            FULL_API_ENDPOINT + API_ENDPOINTS.ME,
            user.accessToken as string,
            user.refreshToken as string,
            {}
        );
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
                        ...userData.data,
                    },
                });
            };
            loadData();
        }
    }, [user.accessToken, user.refreshToken]);

    interface defaultLoginValues {
        username: string;
        password: string;
    }
    const [loginFormValues, setLoginFormValues] =
        React.useState<defaultLoginValues>({
            username: "",
            password: "",
        });

    const handleLogin = async (
        event: React.FormEvent,
        loginFormValues: defaultLoginValues
    ) => {
        event.preventDefault();
        try {
            const response = await sendRequest(
                "post",
                FULL_API_ENDPOINT +
                    API_ENDPOINTS.AUTH.BASE +
                    API_ENDPOINTS.AUTH.LOGIN,
                "",
                "",
                { ...loginFormValues }
            );
            dispatch({
                type: USER_ACTIONS.LOGIN,
                payload: {
                    accessToken: response.data.access,
                    refreshToken: response.data.refresh,
                },
            });
        } catch (e) {
            if (e instanceof AxiosError) {
                throw new Error(e.message);
            }
            throw new Error("Unknown error occurred!");
        }
    };

    if (modalType === "Login") {
        return (
            <React.Fragment>
                <Modal open={open} onClose={onClose}>
                    <Box sx={style}>
                        <Typography sx={{ marginBottom: "1em" }}>
                            Welcome to Homey! To log in, please fill out your
                            credentials.
                        </Typography>
                        <Box
                            sx={{
                                display: "flex",
                                flexDirection: "column",
                            }}
                        >
                            <form
                                onSubmit={(event) =>
                                    handleLogin(event, loginFormValues)
                                }
                            >
                                <FormControl sx={{ marginBottom: "1em" }}>
                                    <InputLabel htmlFor="username">
                                        Username
                                    </InputLabel>
                                    <Input
                                        value={loginFormValues.username}
                                        onChange={(event) =>
                                            setLoginFormValues({
                                                ...loginFormValues,
                                                username: event.target.value,
                                            })
                                        }
                                        id="username"
                                    />
                                </FormControl>
                                <FormControl sx={{ marginBottom: "1em" }}>
                                    <InputLabel htmlFor="password">
                                        Password
                                    </InputLabel>
                                    <Input
                                        type="password"
                                        value={loginFormValues.password}
                                        onChange={(event) =>
                                            setLoginFormValues({
                                                ...loginFormValues,
                                                password: event.target.value,
                                            })
                                        }
                                        id="password"
                                    />
                                </FormControl>
                                <Button type="submit">Login</Button>
                            </form>
                        </Box>
                    </Box>
                </Modal>
            </React.Fragment>
        );
    }
    return (
        <React.Fragment>
            <Modal open={open} onClose={onClose}>
                <Box sx={style}>
                    <Typography>This is a register text sample</Typography>
                </Box>
            </Modal>
        </React.Fragment>
    );
}
