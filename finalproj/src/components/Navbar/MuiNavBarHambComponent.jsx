import { Menu } from "@mui/material";
import React from "react";
import NavLinkComponent from "./NavLinkComponent";
import ROUTES from "../../routes/ROUTES";
const MuiNavBarHambComponent = ({
  anchorElNavProp,
  handleCloseNavMenuProp,
  pagesArray,
  isLoggedInProp,
  authedPagesProp,
  logoutClickProp,
  notAuthPagesProp,
  isAdminProp,
  isBizProp,
  adminPagesArr,
  bizPagesArr,
}) => {
  return (
    <Menu
      id="menu-appbar"
      anchorEl={anchorElNavProp}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "left",
      }}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "left",
      }}
      open={Boolean(anchorElNavProp)}
      onClose={handleCloseNavMenuProp}
      sx={{
        display: { xs: "block", md: "none" },
      }}
    >
      {pagesArray.map((page) => (
        <NavLinkComponent key={page.url} {...page} />
      ))}
      {isAdminProp
        ? adminPagesArr.map((page) => (
            <NavLinkComponent key={page.url} {...page} />
          ))
        : ""}
      {isBizProp
        ? bizPagesArr.map((page) => (
            <NavLinkComponent key={page.url} {...page} />
          ))
        : ""}
      {isLoggedInProp
        ? authedPagesProp.map((page) =>
            page.url === ROUTES.LOGOUT ? (
              <NavLinkComponent
                key={page.url}
                {...page}
                onClick={logoutClickProp}
              />
            ) : (
              <NavLinkComponent key={page.url} {...page} />
            )
          )
        : notAuthPagesProp.map((page) => (
            <NavLinkComponent key={page.url} {...page} />
          ))}
    </Menu>
  );
};

export default MuiNavBarHambComponent;
