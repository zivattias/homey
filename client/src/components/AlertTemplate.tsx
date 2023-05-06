import QuestionMarkIcon from "@mui/icons-material/QuestionMark";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import CloseIcon from "@mui/icons-material/Close";
import { AlertTemplateProps } from "react-alert";
import { Box } from "@mui/material";

const AlertTemplate = ({
  message,
  options,
  style,
  close,
}: AlertTemplateProps) => {
  const alertStyle = {
    backgroundColor: "white",
    color:
      options.type == "error"
        ? "#8B0000"
        : options.type == "success"
        ? "#4BB543"
        : "black",
    padding: "10px",
    paddingY: "20px",
    borderRadius: "10px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    boxShadow: "0px 2px 2px 2px rgba(0, 0, 0, 0.03)",
    width: "auto",
    height: "50px",
    border:
      options.type == "error"
        ? "1px solid #8B0000"
        : options.type == "success"
        ? "1px solid #4BB543"
        : "1px solid black",
  };

  const buttonStyle = {
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: "20px",
    border: "none",
    backgroundColor: "transparent",
    cursor: "pointer",
    color: alertStyle.color,
  };

  return (
    <div
      style={{
        ...alertStyle,
        ...style,
        boxSizing: "border-box",
      }}
    >
      <Box
        sx={{
          marginRight: "0.5em",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {options.type === "info" && <QuestionMarkIcon />}
        {options.type === "success" && <CheckCircleIcon />}
        {options.type === "error" && <ErrorIcon />}
      </Box>
      <span style={{ flex: 2 }}>{message}</span>
      <button onClick={close} style={buttonStyle}>
        <CloseIcon />
      </button>
    </div>
  );
};

export default AlertTemplate;
