import { ModalProps } from "@mui/material";
import { AxiosError } from "axios";
import React from "react";
import {
    USER_ACTIONS,
    useUser,
    useUserDispatch,
} from "../../context/UserContext";
import { API_ENDPOINTS, FULL_API_ENDPOINT } from "../../utils/consts";
import sendRequest from "../../utils/funcs/sendRequest";
import LoginModal from "./LoginModal";
import RegisterModal from "./RegisterModal";

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
    width: { xs: "80%", sm: "70%", md: "50%", lg: "35%" },
    bgcolor: "background.paper",
    boxShadow: 24,
};

interface AuthModalProps extends ModalProps {
    open: boolean;
    onClose: () => void;
    modalType: string;
}

export interface FormValues {
    username: string;
    password: string;
    confirm_password?: string;
    email?: string;
    first_name?: string;
    last_name?: string;
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
            {}
        );
        setLoading(false);
        onClose();
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

    const [loginFormValues, setLoginFormValues] = React.useState<FormValues>({
        username: "",
        password: "",
    });

    const [registerFormValues, setRegisterFormValues] =
        React.useState<FormValues>({
            username: "",
            password: "",
            confirm_password: "",
            email: "",
            first_name: "",
            last_name: "",
        });

    const handleSubmission = async (
        event: React.FormEvent,
        submissionFormValues: FormValues,
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
                const response = await sendRequest(
                    "post",
                    FULL_API_ENDPOINT +
                        API_ENDPOINTS.AUTH.BASE +
                        API_ENDPOINTS.AUTH.REGISTER,
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
            <LoginModal
                open={open}
                onClose={onClose}
                style={style}
                setLoading={setLoading}
                loading={loading}
                handleSubmission={handleSubmission}
                loginFormValues={loginFormValues}
                setLoginFormValues={setLoginFormValues}
            />
        );
    }
    return (
        <RegisterModal
            open={open}
            onClose={onClose}
            style={style}
            setLoading={setLoading}
            loading={loading}
            handleSubmission={handleSubmission}
            registerFormValues={registerFormValues}
            setRegisterFormValues={setRegisterFormValues}
        />
    );
}
