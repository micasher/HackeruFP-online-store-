import { useEffect, useState } from "react";
import Avatar from "@mui/material/Avatar";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Alert from "@mui/material/Alert";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import ROUTES from "../routes/ROUTES";
import validateLoginSchema from "../validation/loginValidation";
import useLoggedIn from "../hooks/useLoggedIn";
import { toast } from "react-toastify";
import FormButtonsComponent from "../components/FormButtonsComponent";
import { useSelector } from "react-redux";
const LoginPage = () => {
  const [inputState, setInputState] = useState({
    email: "",
    password: "",
  });
  const [inputsErrorsState, setInputsErrorsState] = useState(null);
  const loggedIn = useLoggedIn();
  const navigate = useNavigate();
  const [disableEd, setDisableEdit] = useState(false);
  const { payload } = useSelector((bigSlice) => bigSlice.authSlice);
  useEffect(() => {
    if (payload) {
      navigate(ROUTES.HOME);
      toast.error("Logout first");
    }
  }, []);
  const handleBtnClick = async (ev) => {
    try {
      const joiResponse = validateLoginSchema(inputState);
      setInputsErrorsState(joiResponse);
      if (joiResponse) {
        return;
      }
      // Check if the user is blocked

      const { data } = await axios.post("/users/login", inputState);
      localStorage.setItem("token", data.token);
      loggedIn();
      navigate(ROUTES.HOME);
    } catch (err) {
      toast.error("Error, not a registered user");
    }
  };
  const handleInputChange = (ev) => {
    let newInputState = JSON.parse(JSON.stringify(inputState));
    newInputState[ev.target.id] = ev.target.value;
    setInputState(newInputState);
    const joiResponse = validateLoginSchema(newInputState);
    if (!joiResponse) {
      setInputsErrorsState(joiResponse);
      setDisableEdit(false);
      return;
    }
    const inputKeys = Object.keys(inputState);
    for (const key of inputKeys) {
      if (inputState && !inputState[key] && key !== ev.target.id) {
        joiResponse[key] = "";
      }
    }
    setInputsErrorsState(joiResponse);
    setDisableEdit(true);
  };
  const handleClearClick = () => {
    setInputState({
      email: "",
      password: "",
    });
    setInputsErrorsState(null);
  };
  const handleCancelBtnClick = (ev) => {
    navigate(ROUTES.HOME);
  };
  return (
    <>
      <Container component="main" maxWidth="xs">
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <Box component="div" noValidate sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  value={inputState.email}
                  onChange={handleInputChange}
                />
                {inputsErrorsState && inputsErrorsState.email && (
                  <Alert severity="warning">
                    {inputsErrorsState.email.map((item) => (
                      <div key={"email-errors" + item}>{item}</div>
                    ))}
                  </Alert>
                )}
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                  value={inputState.password}
                  onChange={handleInputChange}
                />
                {inputsErrorsState && inputsErrorsState.password && (
                  <Alert severity="warning">
                    {inputsErrorsState.password.map((item) => (
                      <div key={"password-errors" + item}>{item}</div>
                    ))}
                  </Alert>
                )}
              </Grid>
            </Grid>
            <FormButtonsComponent
              onCancel={handleCancelBtnClick}
              onReset={handleClearClick}
              onRegister={handleBtnClick}
              clickBtnText="Sign In"
              disableProp={disableEd}
            />
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link to={ROUTES.REGISTER}>
                  <Typography variant="body2">
                    Did not have an account? Sign up
                  </Typography>
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </>
  );
};

export default LoginPage;
