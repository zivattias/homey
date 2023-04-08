import React from "react";
import { LoadingButton } from "@mui/lab";
import {
    Button,
    Divider,
    FormControl,
    Input,
    InputLabel,
    Modal,
    ModalProps,
    Box,
    Typography,
} from "@mui/material";
import { FormValues } from "./AuthModal";

interface RegisterModalProps {
    open: boolean;
    onClose: () => void;
    style: object;
    setLoading: React.Dispatch<React.SetStateAction<boolean>>;
    handleSubmission: (
        event: React.FormEvent,
        submissionFormValues: FormValues,
        type: "login" | "register"
    ) => Promise<void>;
    registerFormValues: FormValues;
    setRegisterFormValues: React.Dispatch<React.SetStateAction<FormValues>>;
    loading: boolean;
}

function RegisterModal({
    open,
    onClose,
    style,
    loading,
    setLoading,
    handleSubmission,
    registerFormValues,
    setRegisterFormValues,
}: RegisterModalProps) {
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

export default RegisterModal;
