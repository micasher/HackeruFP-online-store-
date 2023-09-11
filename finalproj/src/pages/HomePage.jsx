import { Box, CircularProgress, Grid, List, Tooltip } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Divider } from "@mui/material";
import CardComponent from "../components/CardComponent";
import Typography from "@mui/material/Typography";
import { toast } from "react-toastify";
import useQueryParams from "../hooks/useQueryParams";
import { useSelector } from "react-redux";
import ROUTES from "../routes/ROUTES";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import GridViewIcon from "@mui/icons-material/GridView";
import ListComponent from "../components/ListComponent";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import FilterAltOffIcon from "@mui/icons-material/FilterAltOff";
import SortIcon from "@mui/icons-material/Sort";
import FilterListIcon from "@mui/icons-material/FilterList";
const HomePage = () => {
  const [displayMode, setDisplayMode] = useState(1);
  const [originalCardsArr, setOriginalCardsArr] = useState(null);
  const [cardsArr, setCardsArr] = useState(null);
  const [isStockFiltered, setIsStockFiltered] = useState(false);
  const [ascOrDesc, setAscOrDesc] = useState(null);
  const navigate = useNavigate();
  let qparams = useQueryParams();
  const payload = useSelector((bigPie) => bigPie.authSlice.payload);

  useEffect(() => {
    axios
      .get("/cards/cards")
      .then(({ data }) => {
        setCardsArr(data);
        filterFunc(data);
      })
      .catch((err) => {
        if (err && err.response && err.response.data && err.response.data.msg) {
          toast.error(err.response.data.msg);
        } else {
          toast.error("something went wrong, try again later please!");
        }
      });
  }, []);
  const filterFunc = (data) => {
    if (!originalCardsArr && !data) {
      return;
    }
    let filter = "";
    if (qparams.filter) {
      filter = qparams.filter;
    }
    if (!originalCardsArr && data) {
      setOriginalCardsArr(data);
      setCardsArr(data.filter((card) => card.title.startsWith(filter)));
      return;
    }
    if (originalCardsArr) {
      let newOriginalCardsArr = JSON.parse(JSON.stringify(originalCardsArr));
      setCardsArr(
        newOriginalCardsArr.filter((card) => card.title.startsWith(filter))
      );
    }
  };
  useEffect(() => {
    filterFunc();
  }, [qparams.filter]);
  useEffect(() => {
    if (!originalCardsArr) {
      return;
    }
    if (isStockFiltered) {
      let newCardsArr = JSON.parse(JSON.stringify(originalCardsArr));
      newCardsArr = newCardsArr.filter((card) => card && card.stock != 0);
      setCardsArr(newCardsArr);
    } else {
      let newCardsArr = JSON.parse(JSON.stringify(originalCardsArr));
      setCardsArr(newCardsArr);
    }
  }, [isStockFiltered]);
  useEffect(() => {
    if (!originalCardsArr) {
      return;
    }
    if (ascOrDesc == "asc") {
      let newCardsArr = JSON.parse(JSON.stringify(originalCardsArr));
      newCardsArr = newCardsArr.sort((a, b) => a.price - b.price);
      setCardsArr(newCardsArr);
    } else if (ascOrDesc == "desc") {
      let newCardsArr = JSON.parse(JSON.stringify(originalCardsArr));
      newCardsArr = newCardsArr.sort((a, b) => b.price - a.price);
      setCardsArr(newCardsArr);
    } else {
      let newCardsArr = JSON.parse(JSON.stringify(originalCardsArr));
      setCardsArr(newCardsArr);
    }
  }, [ascOrDesc]);
  const sortASC = () => {
    setAscOrDesc("asc");
  };
  const sortDESC = () => {
    setAscOrDesc("desc");
  };
  const removeSort = () => {
    setAscOrDesc("remove");
  };
  const handleChangeDisplayModeToNormal = () => {
    setDisplayMode(1);
  };
  const handleChangeDisplayModeToList = () => {
    setDisplayMode(2);
  };
  const handleDeleteFromInitialCardsArr = async (id) => {
    try {
      await axios.delete("/cards/card/" + id); // /cards/:id
      setCardsArr((newCardsArr) =>
        newCardsArr.filter((item) => item._id !== id)
      );
      toast.success("Item deleted successfully");
    } catch (err) {
      if (err && err.response && err.response.data && err.response.data.msg) {
        toast.error(err.response.data.msg);
      } else {
        toast.error("something went wrong, try again later please!");
      }
    }
  };
  const handleEditFromInitialCardsArr = (id) => {
    navigate(`${ROUTES.EDITCARD}/${id}`); //localhost:3000/edit/123213
  };

  const handleCartBtnClick = async (id) => {
    if (!payload) {
      toast.warning("please login first in order to add items to your cart!");
      navigate(ROUTES.LOGIN);
      return;
    }
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
        toast.error(err.response.data.msg);
      } else {
        toast.error("something went wrong, try again later please!");
      }
    }
  };

  const handleImageToShowData = (id) => {
    navigate(`${ROUTES.CARDDATA}/${id}`);
  };

  const filterOnStock = () => {
    if (!originalCardsArr) {
      return;
    }
    setIsStockFiltered(!isStockFiltered);
  };

  if (!cardsArr) {
    return <CircularProgress />;
  }
  return (
    <Box>
      <Typography variant="h2" color="primary" align="center">
        Welcome to Your Pet Store
      </Typography>
      <Typography variant="h6" color="secondary" align="center">
        A small boutique shop for all of your animals playWOOFul needs!
      </Typography>
      <br />
      <Divider />
      <h2>Our Products</h2>
      <br />
      <Grid container spacing={2}>
        <Grid item xs={4}>
          <Typography variant="h6" color="primary" align="center">
            Filter
          </Typography>
        </Grid>
        <Grid item xs={4}>
          <Typography variant="h6" color="primary" align="center">
            Sort
          </Typography>
        </Grid>
        <Grid item xs={4}>
          <Typography variant="h6" color="secondary" align="center">
            Display
          </Typography>
        </Grid>
      </Grid>
      <Grid container spacing={2} sx={{ textAlign: "center" }}>
        <Grid item xs={4}>
          <Tooltip
            title={isStockFiltered ? "Show all items" : "Show only on stock"}
          >
            <Box component="h6">
              {isStockFiltered ? (
                <FilterAltOffIcon
                  onClick={filterOnStock}
                  sx={{
                    fontSize: "2rem",
                    ":hover": {
                      border: "0.2rem solid white",
                      cursor: "pointer",
                    },
                  }}
                />
              ) : (
                <FilterAltIcon
                  onClick={filterOnStock}
                  sx={{
                    fontSize: "2rem",
                    ":hover": {
                      border: "0.2rem solid white",
                      cursor: "pointer",
                    },
                  }}
                />
              )}
            </Box>
          </Tooltip>
        </Grid>
        <Grid item xs={4}>
          <Tooltip title="Sort price from high to low">
            <SortIcon
              onClick={sortDESC}
              sx={{
                fontSize: "2rem",
                m: 2,
                ":hover": { border: "0.2rem solid white", cursor: "pointer" },
              }}
            />
          </Tooltip>
          <Tooltip title="Sort price from low to high">
            <SortIcon
              onClick={sortASC}
              sx={{
                transform: "rotateX(180deg)",
                fontSize: "2rem",
                m: 2,
                ":hover": { border: "0.2rem solid white", cursor: "pointer" },
              }}
            />
          </Tooltip>
          <Tooltip title="Remove sort">
            <FilterListIcon
              onClick={removeSort}
              sx={{
                fontSize: "2rem",
                m: 2,
                ":hover": { border: "0.2rem solid white", cursor: "pointer" },
              }}
            />
          </Tooltip>
        </Grid>
        <Grid item xs={4}>
          <Tooltip title="Normal display">
            <GridViewIcon
              onClick={handleChangeDisplayModeToNormal}
              sx={{
                fontSize: "2rem",
                m: 2,
                ":hover": { border: "0.2rem solid white", cursor: "pointer" },
              }}
            />
          </Tooltip>
          <Tooltip title="List display">
            <FormatListBulletedIcon
              onClick={handleChangeDisplayModeToList}
              sx={{
                fontSize: "2rem",
                m: 2,
                ":hover": { border: "0.2rem solid white", cursor: "pointer" },
              }}
            />
          </Tooltip>
        </Grid>
      </Grid>
      <Divider sx={{ mb: 4 }} />
      {displayMode == 1 ? (
        <Grid container spacing={2}>
          {cardsArr.map((item) => (
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
        <List>
          {cardsArr.map((item) => (
            <ListComponent
              key={item._id + Date.now()}
              cardProp={item}
              payloadProp={payload}
              handleCartBtnClickFunc={handleCartBtnClick}
              handleImageToShowDataFunc={handleImageToShowData}
              handleDeleteFromInitialCardsArrFunc={
                handleDeleteFromInitialCardsArr
              }
              handleEditFromInitialCardsArrFunc={handleEditFromInitialCardsArr}
            />
          ))}
        </List>
      )}
    </Box>
  );
};
export default HomePage;
