import { Button, Grid } from "@mui/material";
import React, { Fragment } from "react";
import AutorenewOutlinedIcon from "@mui/icons-material/AutorenewOutlined";
const FormButtonsComponent = ({ onRegister, clickBtnText, disableProp }) => {
  const handleBtnClick = () => {
    onRegister();
  };
  return (
    <Button
      fullWidth
      variant="contained"
      sx={{ mt: 3, mb: 2 }}
      onClick={handleBtnClick}
      color="success"
      disabled={disableProp}
    >
      {clickBtnText}
    </Button>
  );
};

export default FormButtonsComponent;
