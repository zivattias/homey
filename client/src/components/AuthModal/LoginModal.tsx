import React from "react";
import { LoadingButton } from "@mui/lab";
import {
    Divider,
    Modal,
    Box,
    Typography,
    TextField,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
} from "@mui/material";
import { FormValues } from "./AuthModal";

interface LoginModalProps {
    open: boolean;
    onClose: () => void;
    style: object;
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
                            id="username"
                            sx={{ marginBottom: "1em" }}
                            type="text"
                            value={loginFormValues.username}
                            onChange={(event) =>
                                setLoginFormValues({
                                    ...loginFormValues,
                                    username: event.target.value,
                                })
                            }
                        />
                        <TextField
                            sx={{ marginBottom: "1em" }}
                            id="password"
                            type="password"
                            value={loginFormValues.password}
                            onChange={(event) =>
                                setLoginFormValues({
                                    ...loginFormValues,
                                    password: event.target.value,
                                })
                            }
                        />
                        <LoadingButton loading={loading} type="submit">
                            Login
                        </LoadingButton>
                    </Box>
                </Box>
            </Modal>
        </React.Fragment>
    );
}

export default LoginModal;
