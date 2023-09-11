import { NavLink } from "react-router-dom";
import Typography from "@mui/material/Typography";

const NavLinkComponent = ({ url, label, ...rest }) => {
  return (
    <NavLink to={url} {...rest}>
      {({ isActive }) => (
        <Typography
          sx={{
            my: 2,
            display: "block",
            p: 2,
          }}
          color={isActive ? "warning.main" : "text.primary"}
        >
          {label}
        </Typography>
      )}
    </NavLink>
  );
};

export default NavLinkComponent;
