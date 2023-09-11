import React from "react";
import makeALegitStringForImage from "../utils/makeLegitStringForImage";
import AddShoppingCartOutlinedIcon from "@mui/icons-material/AddShoppingCartOutlined";
import RemoveShoppingCartOutlinedIcon from "@mui/icons-material/RemoveShoppingCartOutlined";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import EditNoteIcon from "@mui/icons-material/EditNote";
import {
  Avatar,
  Box,
  IconButton,
  ListItem,
  ListItemAvatar,
  ListItemIcon,
  Typography,
} from "@mui/material";

const ListComponent = ({
  cardProp,
  payloadProp,
  handleCartBtnClickFunc,
  handleDeleteFromInitialCardsArrFunc,
  handleEditFromInitialCardsArrFunc,
  handleImageToShowDataFunc,
}) => {
  const handleCartBtnClick = () => {
    if (!cardProp) {
      return;
    }
    handleCartBtnClickFunc(cardProp._id);
  };
  const handleEditFromInitialCardsArr = () => {
    if (!cardProp) {
      return;
    }
    handleEditFromInitialCardsArrFunc(cardProp._id);
  };
  const handleClickToShowData = () => {
    if (!cardProp) {
      return;
    }
    handleImageToShowDataFunc(cardProp._id);
  };
  const handleDeleteFromInitialCardsArr = () => {
    if (!cardProp) {
      return;
    }
    handleDeleteFromInitialCardsArrFunc(cardProp._id);
  };
  if (!cardProp) {
    return "";
  }
  return (
    <ListItem
      disablePadding
      key={cardProp._id + Date.now()}
      sx={{
        p: 1,
        marginBlock: 2,
        justifyContent: "space-between",
        borderRadius: "50px",
        transition: "all 0.2s cubic-bezier(0.12,0.8,1,0.6)",
        ":hover": {
          backgroundColor: "#826292",
        },
      }}
    >
      <Box component="span" sx={{ display: "flex", alignItems: "center" }}>
        <ListItemAvatar>
          <Avatar
            sx={{ width: 60, height: 60, mr: 2 }}
            src={makeALegitStringForImage(cardProp)}
          />
        </ListItemAvatar>
        <Typography component="h4" variant="h6" sx={{ marginLeft: 4 }}>
          {cardProp.title}
        </Typography>
        <Typography
          component="h4"
          variant="h6"
          color="#c2f212"
          sx={{ marginLeft: 4 }}
        >
          ${cardProp.price}
        </Typography>
        <Typography
          component="h4"
          variant="h6"
          color="#52a292"
          sx={{ marginLeft: 4 }}
        >
          {cardProp && cardProp.hasOwnProperty("stock")
            ? cardProp.stock == 0
              ? "Out of stock for now!"
              : cardProp.stock + " Left"
            : ""}
        </Typography>
      </Box>
      <Box
        component="span"
        sx={{ display: "flex", alignItems: "center", mr: 8 }}
      >
        {payloadProp && cardProp.cart.includes(payloadProp._id) ? (
          <ListItemIcon onClick={handleCartBtnClick}>
            <IconButton
              sx={{
                ":hover": { border: "0.2rem solid white" },
              }}
            >
              <RemoveShoppingCartOutlinedIcon
                sx={{ fontSize: "2rem" }}
                color="success"
              />
            </IconButton>
          </ListItemIcon>
        ) : (
          <ListItemIcon onClick={handleCartBtnClick}>
            <IconButton
              sx={{
                ":hover": { border: "0.2rem solid white" },
              }}
            >
              <AddShoppingCartOutlinedIcon
                sx={{ fontSize: "2rem" }}
                color="success"
              />
            </IconButton>
          </ListItemIcon>
        )}
        {payloadProp && payloadProp.isAdmin ? (
          <>
            <ListItemIcon onClick={handleEditFromInitialCardsArr}>
              <IconButton
                sx={{
                  ":hover": { border: "0.2rem solid white" },
                }}
              >
                <EditNoteIcon sx={{ fontSize: "2rem" }} color="warning" />
              </IconButton>
            </ListItemIcon>
            <ListItemIcon onClick={handleDeleteFromInitialCardsArr}>
              <IconButton
                sx={{
                  ":hover": { border: "0.2rem solid white" },
                }}
              >
                <DeleteIcon sx={{ fontSize: "2rem" }} color="error" />
              </IconButton>
            </ListItemIcon>
          </>
        ) : (
          ""
        )}
        <ListItemIcon onClick={handleClickToShowData}>
          <IconButton
            sx={{
              ":hover": { border: "0.2rem solid white" },
            }}
          >
            <VisibilityOutlinedIcon sx={{ fontSize: "2rem" }} color="primary" />
          </IconButton>
        </ListItemIcon>
      </Box>
    </ListItem>
  );
};

export default ListComponent;
