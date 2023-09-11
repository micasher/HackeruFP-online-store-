import { useState, useEffect } from "react";
import * as React from "react";
import CssBaseline from "@mui/material/CssBaseline";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import validateEditProfileSchema from "../validation/editProfileValidation";
import { Alert, CircularProgress } from "@mui/material";
import { useNavigate } from "react-router-dom";
import ROUTES from "../routes/ROUTES";
import axios from "axios";
import EditProfileFieldComponent from "../components/EditProfileComponent";
import { toast } from "react-toastify";
import FormButtonsComponent from "../components/FormButtonsComponent";
import makeALegitStringForImage from "../utils/makeLegitStringForImage";
import useLoggedIn from "../hooks/useLoggedIn";

const ProfilePage = () => {
  const loggedIn = useLoggedIn();
  const [inputState, setInputState] = useState({
    first: "",
    last: "",
    email: "",
  });
  const [inputsErrorsState, setInputsErrorsState] = useState({});
  const [profilePic, setProfilePic] = useState("");
  const [disableEd, setDisableEdit] = useState(false);
  const [alertFile, setAlertFile] = useState(false);
  const [fileSize, setFileSize] = useState(0);
  const [idOfUser, setIdOfUser] = useState("");
  const navigate = useNavigate();
  const arrOfInputs = [
    { inputName: "First Name", idAndKey: "first", isReq: true },
    { inputName: "Last Name", idAndKey: "last", isReq: true },
    { inputName: "Email", idAndKey: "email", isReq: true },
  ];

  useEffect(() => {
    (async () => {
      try {
        const { data } = await axios.get("/users/userInfo/");
        delete data.__v;
        setIdOfUser(data._id);
        setProfilePic(makeALegitStringForImage(data, "user"));
        delete data._id;
        delete data.createdAt;
        delete data.isAdmin;
        delete data.password;
        delete data.image;
        data.first = data.name.first;
        data.last = data.name.last;
        delete data.name;
        setInputState(data);
      } catch (err) {
        if (err && err.response && err.response.data && err.response.data.msg) {
          toast.error(err.response.data.msg);
        } else {
          toast.error("something went wrong, try again later please!");
        }
      }
    })();
  }, []);
  useEffect(() => {
    const joiResponse = validateEditProfileSchema(inputState);
    if (!joiResponse && (!fileSize || fileSize < 1048576)) {
      setInputsErrorsState(joiResponse);
      setDisableEdit(false);
      return;
    }
    setDisableEdit(true);
  }, [fileSize]);
  if (!inputState) {
    return <CircularProgress />;
  }

  const handleBtnClick = async (ev) => {
    try {
      const joiResponse = validateEditProfileSchema(inputState);

      setInputsErrorsState(joiResponse);
      if (joiResponse) {
        return;
      }
      await axios.put("/users/edituser/" + idOfUser, {
        name: {
          first: inputState.first,
          last: inputState.last,
        },
        email: inputState.email,
        image: {
          imageFile: {
            data: profilePic,
            contentType: `image/${profilePic.split(";")[0].split("/")[1]}`,
          },
          alt: "Profile Picture",
        },
      });
      loggedIn();
      toast.success("User updated successfully");
      navigate(ROUTES.HOME);
    } catch (err) {
      if (err && err.response && err.response.data && err.response.data.msg) {
        toast.error(err.response.data.msg);
      } else {
        toast.error("something went wrong, try again later please!");
      }
    }
  };

  const handleInputChange = (ev) => {
    let newInputState = JSON.parse(JSON.stringify(inputState));
    newInputState[ev.target.id] = ev.target.value;
    setInputState(newInputState);
    const joiResponse = validateEditProfileSchema(newInputState);
    if (!joiResponse && fileSize < 1048576) {
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
        <Box
          component="img"
          sx={{
            maxHeight: { xs: 233, md: 167 },
            maxWidth: { xs: 350, md: 250 },
            mb: 3,
          }}
          alt={inputState.alt ? inputState.alt : ""}
          src={profilePic}
        />
        <Typography component="h1" variant="h5">
          Edit Profile Page
        </Typography>
        <Box component="div" noValidate sx={{ mt: 3 }}>
          <Grid container spacing={2}>
            {arrOfInputs.map((input) => (
              <Grid item xs={12} sm={6} key={input.inputName}>
                <EditProfileFieldComponent
                  nameOfInput={input.inputName}
                  typeofInput={input.idAndKey}
                  isReq={input.isReq}
                  onInputeChange={handleInputChange}
                  value={inputState[input.idAndKey]}
                />
                {inputsErrorsState && inputsErrorsState[input.idAndKey] && (
                  <Alert severity="warning">
                    {inputsErrorsState[input.idAndKey].map((item) => (
                      <div key={input.idAndKey + "-errors" + item}>{item}</div>
                    ))}
                  </Alert>
                )}
              </Grid>
            ))}
          </Grid>
          <div style={{ marginBlock: "0.6rem" }}>
            <Grid container spacing={2}>
              <Grid item xs={6}>
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
              </Grid>
              {profilePic && (
                <Grid item xs={6}>
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
                </Grid>
              )}
            </Grid>
          </div>
          <FormButtonsComponent
            onRegister={handleBtnClick}
            disableProp={disableEd}
            clickBtnText="Edit Profile"
          />
        </Box>
      </Box>
    </Container>
  );
};

export default ProfilePage;
