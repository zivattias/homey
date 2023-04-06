import { Modal, ModalProps, Typography } from "@mui/material";
import { Box } from "@mui/system";
import React from "react";

const style = {
    position: "absolute" as "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
};

interface AuthModal extends ModalProps {
    open: boolean;
    onClose: () => void;
    modalType: string;
}

export default function AuthModal({ open, onClose, modalType }: AuthModal) {
    if (modalType === "Login") {
        return (
            <React.Fragment>
                <Modal open={open} onClose={onClose}>
                    <Box sx={style}>
                        <Typography>This is a login text sample</Typography>
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
