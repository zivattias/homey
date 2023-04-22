import React from "react";
import { LoadingButton } from "@mui/lab";
import { Divider, Modal, Box, Typography, TextField } from "@mui/material";
import { FormValues } from "./AuthModal";
import { Suite, SuiteRunResult } from "vest";
import { loginSuite } from "../../utils/suites/loginSuite";

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
                            handleSubmission(event, loginFormValues, "login");
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
                        <TextField
                            error={
                                suiteResult.hasErrors("username") ? true : false
                            }
                            helperText={suiteResult.getErrors("username")}
                            id="username"
                            sx={{ marginBottom: "1em" }}
                            type="text"
                            value={loginFormValues.username}
                            onChange={(event) =>
                                handleChange(
                                    event,
                                    "username",
                                    event.target.value
                                )
                            }
                        />
                        <TextField
                            error={
                                suiteResult.hasErrors("password") ? true : false
                            }
                            helperText={suiteResult.getErrors("password")}
                            sx={{ marginBottom: "1em" }}
                            id="password"
                            type="password"
                            value={loginFormValues.password}
                            onChange={(event) =>
                                handleChange(
                                    event,
                                    "password",
                                    event.target.value
                                )
                            }
                        />
                        <LoadingButton
                            disabled={
                                loginFormValues.username == "" ||
                                loginFormValues.password == "" ||
                                suiteResult.hasErrors()
                            }
                            loading={loading}
                            type="submit"
                        >
                            Login
                        </LoadingButton>
                    </Box>
                </Box>
            </Modal>
        </React.Fragment>
    );
}

export default LoginModal;
