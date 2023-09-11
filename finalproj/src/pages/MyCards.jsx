import Typography from "@mui/material/Typography";
import { useEffect, useState } from "react";
import axios from "axios";
import { Divider, Container, Button } from "@mui/material";
import { Box, CircularProgress, Grid } from "@mui/material";
import { useSelector } from "react-redux";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import CardComponent from "../components/CardComponent";
import { useNavigate } from "react-router-dom";
import ROUTES from "../routes/ROUTES";
import { toast } from "react-toastify";

const MyCardsPage = () => {
  const navigate = useNavigate();
  const [cardsArr, setCardsArr] = useState(null);
  const payload = useSelector((bigPie) => bigPie.authSlice.payload);
  useEffect(() => {
    axios
      .get("/cards/cards")
      .then(({ data }) => {
        setCardsArr(data);
      })
      .catch((err) => {
        if (err && err.response && err.response.data && err.response.data.msg) {
          toast.error(err.response.data.msg);
        } else {
          toast.error("something went wrong, try again later please!");
        }
      });
  }, []);
  const handleEditFromInitialCardsArr = (id) => {
    navigate(`${ROUTES.EDITCARD}/${id}`); //localhost:3000/edit/123213
  };
  const handleCreateBtn = () => {
    navigate(ROUTES.CREATE);
  };
  const handleImageToShowData = (id) => {
    navigate(`${ROUTES.CARDDATA}/${id}`);
  };
  const handleDeleteFromInitialCardsArr = async (id) => {
    try {
      await axios.delete("/cards/card/" + id); // /cards/:id
      setCardsArr((newCardsArr) =>
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

  const addRemoveToLikesArray = async (id) => {
    try {
      let { data } = await axios.patch("/cards/cart/" + id);
      const newCardsArr = JSON.parse(JSON.stringify(cardsArr));
      newCardsArr.map((card) => {
        if (card._id === data._id) {
          card.cart = [...data.cart];
          if (payload && card.cart.includes(payload._id)) {
            toast.success("added to cart");
          } else {
            toast.info("removed from cart");
          }
        }
      });
      setCardsArr(newCardsArr);
    } catch (err) {
      if (err && err.response && err.response.data && err.response.data.msg) {
        err.response.data.msg.startsWith("card validation failed:")
          ? toast.error(
              "invalid card, cannot be added until some details are filled! sorry for the inconvenience"
            )
          : toast.error(err.response.data.msg);
      } else {
        toast.error(
          "invalid card, cannot be added until some details are filled! sorry for the inconvenience"
        );
      }
    }
  };

  if (!cardsArr) {
    return <CircularProgress />;
  }
  if (cardsArr.length === 0) {
    return (
      <Container>
        <h1>No Cards Available!</h1>
        <h2>Click the button below to create your first card!</h2>
        <Button
          variant="outlined"
          onClick={handleCreateBtn}
          endIcon={<AddCircleOutlineIcon />}
        >
          Create
        </Button>
      </Container>
    );
  }
  return (
    <Box>
      <Typography variant="h2" color="primary">
        Your Own Made Card Page
      </Typography>
      <Typography variant="h6" color="primary">
        Here you can find all your business cards
      </Typography>
      <Divider />
      <br />
      <Grid container spacing={2}>
        {cardsArr.map((item) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={item._id + Date.now()}>
            <CardComponent
              cardProp={item}
              onDelete={handleDeleteFromInitialCardsArr}
              onEdit={handleEditFromInitialCardsArr}
              canEdit={
                payload && payload.isAdmin && payload._id === item.user_id
              }
              onClickImage={handleImageToShowData}
              onCart={addRemoveToLikesArray}
              canDelete={payload && payload.isAdmin}
              isCart={payload && item.cart.includes(payload._id)}
            />
          </Grid>
        ))}
        <Grid>
          <Button
            sx={{
              position: "fixed",
              bottom: "20px",
              right: "20px",
              "@media (max-width: 600px)": {
                bottom: "10px",
                right: "10px",
              },
            }}
            variant="outlined"
            onClick={handleCreateBtn}
            endIcon={<AddCircleOutlineIcon />}
          >
            Create
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default MyCardsPage;
