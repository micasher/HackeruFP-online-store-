import {
  Card,
  CardActionArea,
  CardMedia,
  CardHeader,
  CardContent,
  Typography,
  CardActions,
  Button,
} from "@mui/material";
import AddShoppingCartOutlinedIcon from "@mui/icons-material/AddShoppingCartOutlined";
import RemoveShoppingCartOutlinedIcon from "@mui/icons-material/RemoveShoppingCartOutlined";
import DeleteIcon from "@mui/icons-material/Delete";
import defPic from "../assets/imgs/no-image-icon.png";
import makeALegitStringForImage from "../utils/makeLegitStringForImage";
import "./cardComp.css";
import BuyPopup from "./BuyPopup";
import { useState } from "react";
const CardComponent = ({
  cardProp,
  onDelete,
  onEdit,
  canEdit,
  onCart,
  onClickImage,
  canDelete,
  isCart,
  isTheUsersCard,
}) => {
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const handleDeleteBtnClick = () => {
    if (!cardProp) {
      return;
    }
    onDelete(cardProp._id);
  };
  const handleEditBtnClick = () => {
    if (!cardProp) {
      return;
    }
    onEdit(cardProp._id);
  };
  const handleCartBtnClick = () => {
    if (!cardProp) {
      return;
    }
    onCart(cardProp._id);
  };
  const handleImageBtnClick = () => {
    if (!cardProp) {
      return;
    }
    onClickImage(cardProp._id);
  };
  if (!cardProp) {
    return "";
  }
  return (
    <Card sx={{ height: "600px", backgroundColor: "#1b353b" }}>
      <CardActionArea style={{ overflow: "hidden" }}>
        <CardMedia
          className="img-of-card"
          sx={{ height: "300px" }}
          onClick={handleImageBtnClick}
          component="img"
          image={
            cardProp && cardProp.image && cardProp.image.dataStr
              ? makeALegitStringForImage(cardProp, "card")
              : defPic
          }
        />
      </CardActionArea>
      {isTheUsersCard ? (
        <Typography component="h4" variant="h6" color="gold">
          Your Card &#127775;
        </Typography>
      ) : (
        <Typography component="h4" variant="h6">
          {" "}
          &#8192;
        </Typography>
      )}
      <CardHeader title={cardProp && cardProp.title}></CardHeader>
      <CardContent>
        <Typography>
          Stock:{" "}
          {cardProp && cardProp.hasOwnProperty("stock")
            ? cardProp.stock == 0
              ? "Out of stock for now!"
              : cardProp.stock
            : ""}
        </Typography>
        <Typography>Price: $ {cardProp && cardProp.price}</Typography>
      </CardContent>
      <CardActions sx={{ mt: 8 }}>
        {isCart ? (
          <Button>
            <RemoveShoppingCartOutlinedIcon
              color="success"
              onClick={handleCartBtnClick}
            />
          </Button>
        ) : (
          <Button>
            <AddShoppingCartOutlinedIcon
              color="success"
              onClick={handleCartBtnClick}
            />
          </Button>
        )}
        <Button onClick={handleClickOpen}>BUY</Button>
        {canEdit ? (
          <Button variant="text" color="warning" onClick={handleEditBtnClick}>
            Edit
          </Button>
        ) : (
          ""
        )}
        {canDelete ? (
          <Button variant="text" color="error" onClick={handleDeleteBtnClick}>
            <DeleteIcon />
          </Button>
        ) : (
          ""
        )}
      </CardActions>
      <BuyPopup open={open} handleCloseFunc={handleClose} />
    </Card>
  );
};

CardComponent.defaultProps = {
  canEdit: false,
  canDelete: false,
  isTheUsersCard: false,
};

export default CardComponent;
