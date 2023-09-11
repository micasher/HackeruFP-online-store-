import { Fragment, useEffect, useState } from "react";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import ROUTES from "../routes/ROUTES";
import { Button, CircularProgress, Divider, Typography } from "@mui/material";
import KeyboardReturnIcon from "@mui/icons-material/KeyboardReturn";
import { toast } from "react-toastify";
import makeALegitStringForImage from "../utils/makeLegitStringForImage";
const ProfileDataPage = () => {
  const { id } = useParams();
  const [profileState, setProfileState] = useState(null);
  const navigate = useNavigate();
  useEffect(() => {
    axios
      .get(`/users/user/${id}`)
      .then((response) => {
        const currentProfile = { ...response.data };
        currentProfile.first = currentProfile.name.first;
        currentProfile.last = currentProfile.name.last;
        delete currentProfile.name;
        delete currentProfile.password;
        delete currentProfile._id;
        delete currentProfile.__v;
        currentProfile.createdAt = new Date(
          currentProfile.createdAt
        ).toLocaleDateString("hi");
        setProfileState(currentProfile);
        window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
      })
      .catch((err) => {
        if (err && err.response && err.response.data && err.response.data.msg) {
          toast.error(err.response.data.msg);
        } else {
          toast.error("something went wrong, try again later please!");
        }
      });
  }, [id]);

  const handleBackToCRMClick = () => {
    navigate(ROUTES.CRM);
  };
  if (!profileState) {
    return <CircularProgress />;
  }
  return (
    <Container component="main" maxWidth="lg">
      <Button onClick={handleBackToCRMClick} color="error" variant="contained">
        <KeyboardReturnIcon />
      </Button>
      <h1 style={{ margin: -3 }}>Profile Details:</h1>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Box component="div" noValidate sx={{ mt: 3 }}>
          <img
            src={makeALegitStringForImage(profileState, "user")}
            alt={`profile of ${profileState.first || "user"}`}
            style={{
              maxWidth: "300px",
              maxHeight: "300px",
              borderRadius: "25px",
              marginBottom: "0.8rem",
            }}
          />
        </Box>
        <br />
        <Grid container spacing={2}>
          <Grid item xl={6} sm={12}>
            <Typography component="h5" variant="h5">
              User Name:
              <br /> {profileState.first + " " + profileState.last}
            </Typography>
            <Divider />
          </Grid>
          <Grid item xl={6} sm={12}>
            <Typography component="h5" variant="h5">
              Email:
              <br /> {profileState.email}
            </Typography>
            <Divider />
          </Grid>
          <Grid item xl={6} sm={12}>
            <Typography component="h5" variant="h5">
              Created At:
              <br /> {profileState.createdAt}
            </Typography>
            <Divider />
          </Grid>
          <Grid item xl={6} sm={12}>
            <Typography component="h5" variant="h5">
              Admin Status:
              <br /> {profileState.isAdmin ? "admin user" : "regular user"}
            </Typography>
            <Divider />
          </Grid>
          <Grid item xl={6} sm={12}></Grid>
        </Grid>
      </Box>
    </Container>
  );
};
export default ProfileDataPage;
