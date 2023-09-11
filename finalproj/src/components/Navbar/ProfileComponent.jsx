import { AccountCircle } from "@mui/icons-material";
import { Avatar, IconButton, Menu, MenuItem } from "@mui/material";
import React, { Fragment } from "react";
import ROUTES from "../../routes/ROUTES";
import NavLinkComponent from "./NavLinkComponent";
import makeALegitStringForImage from "../../utils/makeLegitStringForImage.js";
const ProfileComponent = ({ profilePages, logoutClickProp, payloadProp }) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const logoutClick = () => {
    logoutClickProp();
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const avatarPages = [...profilePages];
  return (
    <Fragment>
      <IconButton
        size="large"
        aria-label="account of current user"
        aria-controls="menu-appbar"
        aria-haspopup="true"
        onClick={handleMenu}
        color="inherit"
      >
        {payloadProp ? (
          <Avatar
            alt={
              payloadProp.image && payloadProp.image.alt
                ? payloadProp.image.alt
                : "profile of user"
            }
            src={makeALegitStringForImage(payloadProp, "user")}
          />
        ) : (
          <AccountCircle />
        )}
      </IconButton>
      <Menu
        id="menu-appbar"
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        keepMounted
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        {avatarPages.map((page) => (
          <MenuItem
            key={"miniLinks" + page.url}
            onClick={handleClose}
            sx={{ padding: "8px", minWidth: "100px" }}
          >
            {page.url === ROUTES.LOGOUT ? (
              <NavLinkComponent
                key={page.url}
                {...page}
                onClick={logoutClick}
              />
            ) : (
              <NavLinkComponent key={page.url} {...page} />
            )}
          </MenuItem>
        ))}
      </Menu>
    </Fragment>
  );
};

export default ProfileComponent;
