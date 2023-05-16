import * as React from "react";
import AppBar from "@mui/material/AppBar";
import { Box, CircularProgress } from "@mui/material";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import { useTheme } from "@mui/material";
import { ColorModeContext } from "../../App";
import {
  USER_ACTIONS,
  useUser,
  useUserDispatch,
} from "../../context/UserContext";
import AuthModal from "../AuthModal/AuthModal";
import sendRequest from "../../utils/funcs/sendRequest";
import { API_ENDPOINTS, FULL_API_ENDPOINT } from "../../utils/consts";
import { Link, useNavigate } from "react-router-dom";
import pagesEndpoints from "./funcs/pagesEndpoints";
import { useAlert } from "react-alert";

const pages = ["Sublets", "Long-term", "Upload"];
const loggedInSettings = ["Profile", "Account", "Dashboard", "Logout"];
const loggedOutSettings = ["Login", "Register"];

function Navbar() {
  const alert = useAlert();
  const [modalType, setModalType] = React.useState("");
  const [openModal, setOpenModal] = React.useState(false);
  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => setOpenModal(false);
  const user = useUser();
  const dispatch = useUserDispatch();
  const navigate = useNavigate();

  const [isAvatarLoading, setIsAvatarLoading] = React.useState<boolean>(true);

  // Settings-Functions map object:
  const settingsFuncsObj: { [key: string]: () => void } = {
    Logout: () => handleLogout(),
    Profile: () => {
      navigate("/profile");
      handleCloseUserMenu();
    },
    Account: () => {
      navigate("/account");
      handleCloseUserMenu();
    },
    Dashboard: () => {
      navigate("/dashboard");
      handleCloseUserMenu();
    },
  };

  const theme = useTheme();
  const colorMode = React.useContext(ColorModeContext);

  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(
    null
  );
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(
    null
  );

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleLogout = async () => {
    handleCloseUserMenu();
    const response = await sendRequest(
      "post",
      FULL_API_ENDPOINT + API_ENDPOINTS.AUTH.BASE + API_ENDPOINTS.AUTH.LOGOUT,
      user.accessToken!,
      { refresh: user.refreshToken! }
    );
    dispatch({
      type: USER_ACTIONS.BLACKLIST,
      payload: {
        accessToken: user.accessToken,
        refreshToken: user.refreshToken,
      },
    });
    alert.show("Logged out!", { type: "success" });
    if (response.status !== 200) {
      alert.show("Error logging out!", { type: "error" });
      throw new Error("Server-side error occurred");
    }
  };

  return (
    <AppBar
      position="static"
      sx={{ backgroundColor: "inherit", color: "inherit" }}
    >
      <Container maxWidth="xl">
        <Toolbar
          disableGutters
          sx={{ justifyContent: { xs: "space-between" } }}
        >
          <Link
            to="/"
            style={{
              color: "inherit",
              textDecoration: "none",
            }}
          >
            <Typography
              variant="h6"
              noWrap
              component="div"
              sx={{
                mr: 2,
                display: { xs: "none", md: "flex" },
                fontWeight: 700,
                color: "inherit",
                textDecoration: "none",
              }}
            >
              Homey
            </Typography>
          </Link>
          <Box
            sx={{
              display: { xs: "flex", md: "none" },
            }}
          >
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: "flex", md: "none" },
              }}
            >
              {pages.map((page) =>
                user.accessToken == null && page == "Upload" ? null : (
                  <MenuItem
                    key={page}
                    onClick={() => {
                      handleCloseNavMenu();
                      navigate(pagesEndpoints[page]);
                    }}
                  >
                    <Typography color="inherit" textTransform="capitalize">
                      {page}
                    </Typography>
                  </MenuItem>
                )
              )}
              <Box
                sx={{
                  display: "flex",
                  width: "100%",
                  alignItems: "center",
                  justifyContent: "center",
                  bgcolor: "inherit",
                  color: "text.primary",
                  borderRadius: 1,
                  p: 3,
                }}
              >
                <IconButton
                  sx={{ ml: 1 }}
                  onClick={colorMode.toggleColorMode}
                  color="inherit"
                >
                  {theme.palette.mode === "dark" ? (
                    <DarkModeIcon />
                  ) : (
                    <LightModeIcon />
                  )}
                </IconButton>
              </Box>
            </Menu>
          </Box>
          <Link
            to="/"
            style={{
              marginLeft: "auto",
              marginRight: "auto",
              color: "inherit",
              textDecoration: "none",
            }}
          >
            <Typography
              variant="h5"
              noWrap
              sx={{
                px: 2,
                display: { xs: "flex", md: "none" },
                fontWeight: 700,
                color: "inherit",
                textDecoration: "none",
              }}
            >
              Homey
            </Typography>
          </Link>
          <Box
            sx={{
              flexGrow: 1,
              display: { xs: "none", md: "flex" },
            }}
          >
            {pages.map((page) =>
              user.accessToken == null && page == "Upload" ? null : (
                <MenuItem
                  key={page}
                  onClick={() => {
                    handleCloseNavMenu();
                    navigate(pagesEndpoints[page]);
                  }}
                >
                  <Typography color="inherit" textTransform="capitalize">
                    {page}
                  </Typography>
                </MenuItem>
              )
            )}
          </Box>

          <Box
            sx={{
              flexGrow: 0,
              display: { xs: "none", md: "flex" },
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                bgcolor: "inherit",
                color: "text.primary",
                borderRadius: 1,
                p: 3,
              }}
            >
              <IconButton
                sx={{ ml: 1 }}
                onClick={colorMode.toggleColorMode}
                color="inherit"
              >
                {theme.palette.mode === "dark" ? (
                  <DarkModeIcon />
                ) : (
                  <LightModeIcon />
                )}
              </IconButton>
            </Box>
          </Box>

          <Box sx={{ px: 1 }}>
            <Tooltip title="Open settings">
              <IconButton
                onClick={handleOpenUserMenu}
                sx={{
                  position: "relative",
                  height: "33px",
                  width: "33px",
                }}
              >
                {isAvatarLoading && (
                  <CircularProgress size="1em" sx={{ position: "absolute" }} />
                )}
                <Avatar
                  alt="User profile picture"
                  src={user.profilePic ?? ""}
                  sx={{ position: "absolute", pointerEvents: "none" }}
                  imgProps={{
                    onLoad: () => setIsAvatarLoading(false),
                    hidden: isAvatarLoading,
                    referrerPolicy: "no-referrer",
                  }}
                >
                  {user.accessToken && user.firstName && user.lastName
                    ? `${user.firstName.charAt(0).toUpperCase()}${user.lastName
                        .charAt(0)
                        .toUpperCase()}`
                    : null}
                </Avatar>
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: "45px" }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {user.accessToken
                ? loggedInSettings.map((setting) => (
                    <MenuItem
                      key={setting}
                      onClick={
                        settingsFuncsObj.hasOwnProperty(setting)
                          ? settingsFuncsObj[setting]
                          : handleCloseUserMenu
                      }
                    >
                      <Typography textAlign="center">{setting}</Typography>
                    </MenuItem>
                  ))
                : loggedOutSettings.map((setting) => (
                    <MenuItem
                      key={setting}
                      onClick={() => {
                        handleCloseUserMenu();
                        handleOpenModal();
                        setModalType(setting);
                      }}
                    >
                      <Typography textAlign="center">{setting}</Typography>
                    </MenuItem>
                  ))}
              {openModal && modalType ? (
                <AuthModal
                  modalType={modalType}
                  open={openModal}
                  onClose={handleCloseModal}
                  children={<></>}
                />
              ) : null}
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default Navbar;
