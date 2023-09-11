import { useState, useEffect } from "react";
import * as React from "react";
import Avatar from "@mui/material/Avatar";
import CssBaseline from "@mui/material/CssBaseline";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import validateRegisterSchema from "../validation/registerValidation";
import { Alert } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import ROUTES from "../routes/ROUTES";
import axios from "axios";
import RegisterFieldComponent from "../components/RegisterComponent";
import { toast } from "react-toastify";
import FormButtonsComponent from "../components/FormButtonsComponent";
import { useSelector } from "react-redux";

const RegisterPage = () => {
  const [enableRegister, setEnableRegister] = useState(true);
  const [profilePic, setProfilePic] = useState("");
  const [alertFile, setAlertFile] = useState(false);
  const [fileSize, setFileSize] = useState(0);
  const [inputState, setInputState] = useState({
    first: "",
    last: "",
    email: "",
    password: "",
    alt: "",
  });
  const [inputsErrorsState, setInputsErrorsState] = useState({});
  const navigate = useNavigate();
  const { payload } = useSelector((bigSlice) => bigSlice.authSlice);

  useEffect(() => {
    if (payload) {
      navigate(ROUTES.HOME);
      toast.error("Logout first");
    }
  }, [navigate, payload]);
  React.useEffect(() => {
    const joiResponse = validateRegisterSchema(inputState);
    if (!joiResponse && (!fileSize || fileSize < 1048576)) {
      setInputsErrorsState(joiResponse);
      setEnableRegister(false);
      return;
    }
    setEnableRegister(true);
  }, [fileSize]);
  const arrOfInputs = [
    { inputName: "First Name", idAndKey: "first", isReq: true },
    { inputName: "Last Name", idAndKey: "last", isReq: true },
    { inputName: "Email", idAndKey: "email", isReq: true },
    { inputName: "Password", idAndKey: "password", isReq: true },
    { inputName: "Image Alt", idAndKey: "alt", isReq: true },
  ];

  const handleBtnClick = async (ev) => {
    try {
      const JoiResponse = validateRegisterSchema(inputState);
      setInputsErrorsState(JoiResponse);
      if (JoiResponse) {
        return;
      }
      await axios.post("/users/register", {
        name: {
          first: inputState.first,
          last: inputState.last,
        },
        email: inputState.email,
        password: inputState.password,
        image: profilePic
          ? {
              imageFile: {
                data: profilePic,
                contentType: `image/${profilePic.split(";")[0].split("/")[1]}`,
              },
              alt: "Profile Picture",
            }
          : null,
      });
      navigate(ROUTES.LOGIN);
    } catch (err) {
      if (err && err.response && err.response.data) {
        if (
          err.response.data.msg ==
          "The email address is already being used. please choose another email address"
        ) {
          toast.error("email taken");
        } else {
          toast.error(err.response.data.msg);
        }
      } else {
        toast.error("something went wrong, try again later");
      }
    }
  };

  const handleInputChange = (ev) => {
    let newInputState = JSON.parse(JSON.stringify(inputState));
    newInputState[ev.target.id] = ev.target.value;

    setInputState(newInputState);

    const joiResponse = validateRegisterSchema(newInputState);
    if (!joiResponse && fileSize < 1048576) {
      setInputsErrorsState(joiResponse);
      setEnableRegister(false);
      return;
    }

    const inputKeys = Object.keys(inputState);
    for (const key of inputKeys) {
      if (inputState && !inputState[key] && key !== ev.target.id) {
        joiResponse[key] = "";
      }
    }
    setInputsErrorsState(joiResponse);
    setEnableRegister(true);
  };

  const handleFileUpload = (ev) => {
    if (ev.target.files.length > 0) {
      let reader = new FileReader();
      reader.onload = (event) => {
        const file = ev.target.files[0];
        if (file.size > 1048576) {
          setAlertFile(true);
        }
        setFileSize(file.size);
        setProfilePic(reader.result);
      };
      reader.readAsDataURL(ev.target.files[0]);
    }
  };
  const handleRemoveImage = () => {
    setAlertFile(false);
    setProfilePic("");
    setFileSize(0);
  };

  return (
    <Container component="main" maxWidth="md">
      <CssBaseline />
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
          Sign up
        </Typography>
        <Box component="div" noValidate sx={{ mt: 3 }}>
          <Grid container spacing={2}>
            {arrOfInputs.map((input) => (
              <Grid item xs={12} sm={6} key={input.inputName}>
                <RegisterFieldComponent
                  nameOfInput={input.inputName}
                  typeofInput={input.idAndKey}
                  isReq={input.isReq}
                  onInputeChange={handleInputChange}
                  value={inputState[input.idAndKey]}
                />
                {inputsErrorsState &&
                  inputsErrorsState[input.idAndKey] &&
                  !inputsErrorsState[input.idAndKey].find(
                    (item) =>
                      item && item.includes("is not allowed to be empty")
                  ) && (
                    <Alert
                      variant="filled"
                      severity="error"
                      sx={{ marginTop: "0.2rem" }}
                    >
                      {inputsErrorsState[input.idAndKey].map((item) => (
                        <div key={input.idAndKey + "-errors" + item}>
                          {item}
                        </div>
                      ))}
                    </Alert>
                  )}
              </Grid>
            ))}
          </Grid>
          <div style={{ marginBlock: "0.6rem" }}>
            <label
              htmlFor="imageFile"
              style={{
                display: "inline-block",
                padding: "10px 20px",
                fontSize: "16px",
                backgroundColor: "#4CAF50", // Change this to your preferred color
                color: "white",
                cursor: "pointer",
                borderRadius: "4px",
                textAlign: "center",
                textDecoration: "none",
                margin: "0.6rem",
              }}
            >
              Upload Profile Picture
            </label>
            <input
              type="file"
              id="imageFile"
              label="Choose Image"
              onChange={handleFileUpload}
              style={{ display: "none" }} // This hides the default file input field
            />
            {profilePic && (
              <div>
                <img
                  src={profilePic}
                  alt="Profile"
                  style={{
                    borderRadius: "50px",
                    width: "20vw",
                    height: "20vw",
                  }}
                />
                {alertFile ? (
                  <Alert severity="warning" onClose={handleRemoveImage}>
                    File size cannot be above 1MB!
                  </Alert>
                ) : (
                  ""
                )}
                <br />
                <button
                  onClick={handleRemoveImage}
                  style={{
                    padding: "10px 20px",
                    fontSize: "16px",
                    backgroundColor: "#f44336", // Change this to your preferred color
                    color: "white",
                    borderRadius: "4px",
                    margin: "2px 2px",
                    cursor: "pointer",
                  }}
                >
                  Remove Image
                </button>
              </div>
            )}
          </div>
          <FormButtonsComponent
            onRegister={handleBtnClick}
            clickBtnText="Register"
            disableProp={enableRegister}
          />
          <Grid container justifyContent="flex-start">
            <Grid item>
              <Link to={ROUTES.LOGIN}>
                <Typography variant="body2">
                  Already have an account? Sign In
                </Typography>
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
};

export default RegisterPage;
