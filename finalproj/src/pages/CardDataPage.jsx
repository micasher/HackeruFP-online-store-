import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Container,
  Grid,
  Paper,
  Typography,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import makeALegitStringForImage from "../utils/makeLegitStringForImage";

const CustomPaper = ({ children }) => {
  return (
    <Paper elevation={10} sx={{ mt: 3, p: 2 }}>
      {children}
    </Paper>
  );
};

const CardPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [cardState, setCardState] = useState(null);
  useEffect(() => {
    const fetchCardData = async () => {
      try {
        const response = await axios.get(`/cards/card/${id}`);
        const cardData = response.data;
        const newCardState = {
          ...cardData,
        };
        setCardState(newCardState);
      } catch (err) {
        toast.error("problem loading card for now, please try again later");
      }
    };

    fetchCardData();
  }, [id]);

  const handleCancelBtnClick = () => {
    navigate("/");
  };

  if (!cardState) {
    return <CircularProgress />;
  }

  return (
    <Container sx={{ mt: 3 }} component={CustomPaper} maxWidth="xl">
      <br />
      <Grid container>
        <Grid item sm={3}>
          <Button variant="outlined" onClick={handleCancelBtnClick}>
            <FirstPageIcon />
            Back to Home
          </Button>
        </Grid>
      </Grid>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Box
          component="img"
          sx={{
            marginBlock: 2,
            borderRadius: "10px",
            height: { xs: 233, md: 300 },
            width: { xs: 350, md: 500 },
            maxHeight: { xs: 600, md: 600 },
            maxWidth: { xs: 600, md: 600 },
          }}
          alt={cardState.alt ? cardState.alt : ""}
          src={makeALegitStringForImage(cardState, "card")}
        />
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "left",
        }}
      >
        <Box component="div" noValidate sx={{ mt: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ color: "primary" }}>
                Title: {cardState.title}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ color: "primary" }}>
                Description: {cardState.description}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ color: "primary" }}>
                Price: {cardState.price}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ color: "primary" }}>
                Stock: {cardState.stock}
              </Typography>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
};
export default CardPage;
