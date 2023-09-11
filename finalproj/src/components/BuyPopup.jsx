import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import React from "react";

const BuyPopup = ({ open, handleCloseFunc }) => {
  return (
    <Dialog
      open={open}
      onClose={handleCloseFunc}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      {" "}
      <DialogTitle id="alert-dialog-title">
        We're truly sorry, but we are afraid that BUYING this product is not a
        feature yet available!
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          As we are devloping this website, there are a few features not yet to
          be complete. We are truly appriciating your patience and hope to see
          you very soon without stopping you {`;)`}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCloseFunc} autoFocus>
          Ok, I'll wait for next time!
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default BuyPopup;
