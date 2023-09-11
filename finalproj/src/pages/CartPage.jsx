import Typography from "@mui/material/Typography";
import { useEffect, useState } from "react";
import axios from "axios";
import { Button, Divider } from "@mui/material";
import { Box, CircularProgress, Grid } from "@mui/material";
import { useSelector } from "react-redux";
import CardComponent from "../components/CardComponent";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import ROUTES from "../routes/ROUTES";
import thePuc from "../assets/imgs/card.jpg";
const CartPage = () => {
  const navigate = useNavigate();
  const [likedCardsArrState, setLikedCardsArrState] = useState(null);
  const [originalLikedCardsArrState, setOriginalLikedCardsArrState] =
    useState(null);
  const { payload } = useSelector((bigPie) => bigPie.authSlice);
  useEffect(() => {
    axios
      .get("/cards/getcart")
      .then(({ data }) => {
        setOriginalLikedCardsArrState(data);
        setLikedCardsArrState(data);
      })
      .catch((err) => {
        if (err && err.response && err.response.data && err.response.data.msg) {
          toast.error(err.response.data.msg);
        } else {
          toast.error("something went wrong, try again later please!");
        }
      });
  }, []);
  useEffect(() => {
    axios
      .get("/cards/getcart")
      .then(({ data }) => {
        setLikedCardsArrState(data);
      })
      .catch((err) => {
        if (err && err.response && err.response.data && err.response.data.msg) {
          toast.error(err.response.data.msg);
        } else {
          toast.error("something went wrong, try again later please!");
        }
      });
  }, [originalLikedCardsArrState]);
  const handleImageToShowData = (id) => {
    navigate(`${ROUTES.CARDDATA}/${id}`);
  };
  const handleCartBtnClick = async (id) => {
    try {
      let { data } = await axios.patch("/cards/cart/" + id);
      const newCardsArr = JSON.parse(JSON.stringify(likedCardsArrState));
      newCardsArr.map((card) => {
        if (card._id === data._id) {
          card.cart = [...data.cart];
        }
      });
      setLikedCardsArrState(newCardsArr);
      setOriginalLikedCardsArrState(newCardsArr);
      toast.info("Item removed from cart");
    } catch (err) {
      let error = err.response.data;
      error.startsWith("card validation failed:") &&
        toast.error(
          "invalid card, cannot be added until some details are filled! sorry for the inconvenience"
        );
    }
  };
  const handleAddItemsFromHomePageClick = () => {
    navigate(ROUTES.HOME);
  };
  const handleEditFromInitialCardsArr = (id) => {
    navigate(`${ROUTES.EDITCARD}/${id}`); //localhost:3000/edit/123213
  };
  const handleDeleteFromInitialCardsArr = async (id) => {
    try {
      await axios.delete("/cards/card/" + id); // /cards/:id
      setOriginalLikedCardsArrState((newCardsArr) =>
        newCardsArr.filter((item) => item._id !== id)
      );
    } catch (err) {
      if (err && err.response && err.response.data && err.response.data.msg) {
        toast.error(err.response.data.msg);
      } else {
        toast.error("something went wrong, try again later please!");
      }
    }
  };

  if (!likedCardsArrState) {
    return <CircularProgress />;
  }
  return (
    <Box>
      <Typography variant="h2" color="primary">
        Cart <ShoppingCartIcon />
      </Typography>
      <Typography variant="h6" color="primary">
        {!likedCardsArrState.length
          ? "At the moment the cart is empty, but feel free to add some items to your cart!"
          : "Here you can find all your favorite items"}
      </Typography>
      <Divider />
      <br />
      {likedCardsArrState.length ? (
        <Grid container spacing={2}>
          {likedCardsArrState.map((item) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={item._id + Date.now()}>
              <CardComponent
                cardProp={item}
                onDelete={handleDeleteFromInitialCardsArr}
                onEdit={handleEditFromInitialCardsArr}
                canEdit={payload && payload.isAdmin}
                onCart={handleCartBtnClick}
                isCart={payload && item.cart.includes(payload._id)}
                onClickImage={handleImageToShowData}
                canDelete={payload && payload.isAdmin}
              />
            </Grid>
          ))}
        </Grid>
      ) : (
        <Button
          variant="contained"
          size="large"
          onClick={handleAddItemsFromHomePageClick}
          color="success"
        >
          Click here to see our items
          <img
            style={{
              maxWidth: "100px",
              marginLeft: "2rem",
              borderRadius: "25px",
            }}
            src={thePuc}
            alt="Click here to go to home page"
          />
        </Button>
      )}
    </Box>
  );
};

export default CartPage;
