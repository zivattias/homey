import { LoadingButton } from "@mui/lab";
import {
    Button,
    Divider,
    FormControl,
    Input,
    InputLabel,
    Modal,
    ModalProps,
    Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import { AxiosError } from "axios";
import React from "react";
import { USER_ACTIONS, useUser, useUserDispatch } from "../context/UserContext";
import { API_ENDPOINTS, FULL_API_ENDPOINT } from "../utils/consts";
import sendRequest from "../utils/funcs/sendRequest";

const style = {
    borderRadius: "20px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    position: "absolute" as "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: { xs: "90%", sm: "50%" },
    bgcolor: "background.paper",
    boxShadow: 24,
};

interface AuthModalProps extends ModalProps {
    open: boolean;
    onClose: () => void;
    modalType: string;
}

export default function AuthModal({
    open,
    onClose,
    modalType,
}: AuthModalProps) {
    const user = useUser();
    const dispatch = useUserDispatch();
    const [loading, setLoading] = React.useState<boolean>(false);

    const getUserData = async () => {
        const userData = await sendRequest(
            "get",
            FULL_API_ENDPOINT + API_ENDPOINTS.ME,
            user.accessToken as string,
            user.refreshToken as string,
            {}
        );
        setLoading(false);
        onClose();
        return userData;
    };

    React.useEffect(() => {
        console.log("Inside useEffect");
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

    interface defaultRegisterValues {
        username: string;
        password: string;
        confirm_password: string;
        email: string;
        first_name: string;
        last_name: string;
    }

    const [registerFormValues, setRegisterFormValues] =
        React.useState<defaultRegisterValues>({
            username: "",
            password: "",
            confirm_password: "",
            email: "",
            first_name: "",
            last_name: "",
        });

    const handleSubmission = async (
        event: React.FormEvent,
        submissionFormValues: defaultLoginValues | defaultRegisterValues,
        type: "login" | "register"
    ) => {
        event.preventDefault();
        try {
            if (type === "login") {
                const response = await sendRequest(
                    "post",
                    FULL_API_ENDPOINT +
                        API_ENDPOINTS.AUTH.BASE +
                        API_ENDPOINTS.AUTH.LOGIN,
                    "",
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
            } else {
                console.log(submissionFormValues);
                const response = await sendRequest(
                    "post",
                    FULL_API_ENDPOINT +
                        API_ENDPOINTS.AUTH.BASE +
                        API_ENDPOINTS.AUTH.REGISTER,
                    "",
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
                }
            }
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
                                handleSubmission(
                                    event,
                                    loginFormValues,
                                    "login"
                                );
                            }}
                            sx={{
                                width: { xs: "90%", sm: "90%" },
                                display: "flex",
                                flexDirection: "column",
                                py: 2,
                            }}
                        >
                            <Typography
                                sx={{ marginBottom: "1em", fontWeight: "500" }}
                            >
                                Welcome to Homey!
                            </Typography>
                            <FormControl sx={{ marginBottom: "1em" }}>
                                <InputLabel htmlFor="username">
                                    Username
                                </InputLabel>
                                <Input
                                    type="text"
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
                            <LoadingButton loading={loading} type="submit">
                                Login
                            </LoadingButton>
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
                    <Box>
                        <Typography
                            sx={{
                                pt: 4,
                                my: "0em",
                                fontWeight: "500",
                            }}
                        >
                            Register an account
                        </Typography>
                    </Box>
                    <Divider sx={{ width: "100%", m: 0 }} />
                    <Box
                        component="form"
                        onSubmit={(event) => {
                            setLoading(true);
                            handleSubmission(
                                event,
                                registerFormValues,
                                "register"
                            );
                        }}
                        sx={{
                            width: { xs: "90%", sm: "90%" },
                            display: "flex",
                            flexDirection: "column",
                            py: 2,
                        }}
                    >
                        <Typography
                            sx={{ marginBottom: "1em", fontWeight: "500" }}
                        >
                            Welcome to Homey! You're just a step away from
                            joining us.
                        </Typography>
                        <FormControl sx={{ marginBottom: "1em" }}>
                            <InputLabel htmlFor="first_name">
                                First Name
                            </InputLabel>
                            <Input
                                type="text"
                                value={registerFormValues.first_name}
                                onChange={(event) =>
                                    setRegisterFormValues({
                                        ...registerFormValues,
                                        first_name: event.target.value,
                                    })
                                }
                                id="first_name"
                            />
                        </FormControl>
                        <FormControl sx={{ marginBottom: "1em" }}>
                            <InputLabel htmlFor="last_name">
                                Last Name
                            </InputLabel>
                            <Input
                                type="text"
                                value={registerFormValues.last_name}
                                onChange={(event) =>
                                    setRegisterFormValues({
                                        ...registerFormValues,
                                        last_name: event.target.value,
                                    })
                                }
                                id="last_name"
                            />
                        </FormControl>
                        <FormControl sx={{ marginBottom: "1em" }}>
                            <InputLabel htmlFor="email">
                                Email Address
                            </InputLabel>
                            <Input
                                type="email"
                                value={registerFormValues.email}
                                onChange={(event) =>
                                    setRegisterFormValues({
                                        ...registerFormValues,
                                        email: event.target.value,
                                    })
                                }
                                id="email"
                            />
                        </FormControl>
                        <FormControl sx={{ marginBottom: "1em" }}>
                            <InputLabel htmlFor="username">Username</InputLabel>
                            <Input
                                type="text"
                                value={registerFormValues.username}
                                onChange={(event) =>
                                    setRegisterFormValues({
                                        ...registerFormValues,
                                        username: event.target.value,
                                    })
                                }
                                id="username"
                            />
                        </FormControl>
                        <FormControl sx={{ marginBottom: "1em" }}>
                            <InputLabel htmlFor="password">Password</InputLabel>
                            <Input
                                type="password"
                                value={registerFormValues.password}
                                onChange={(event) =>
                                    setRegisterFormValues({
                                        ...registerFormValues,
                                        password: event.target.value,
                                    })
                                }
                                id="password"
                            />
                        </FormControl>
                        <FormControl sx={{ marginBottom: "1em" }}>
                            <InputLabel htmlFor="confirm_password">
                                Confirm Password
                            </InputLabel>
                            <Input
                                type="password"
                                value={registerFormValues.confirm_password}
                                onChange={(event) =>
                                    setRegisterFormValues({
                                        ...registerFormValues,
                                        confirm_password: event.target.value,
                                    })
                                }
                                id="confirm_password"
                            />
                        </FormControl>
                        <LoadingButton loading={loading} type="submit">
                            Register
                        </LoadingButton>
                    </Box>
                </Box>
            </Modal>
        </React.Fragment>
    );
}
