import React, { useState, useEffect } from "react";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Alert from "@mui/material/Alert";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import ROUTES from "../routes/ROUTES";
import { CircularProgress } from "@mui/material";
import { toast } from "react-toastify";
import EditCardPageFieldComponent from "../components/EditCardPageComponent";
import FormButtonsComponent from "../components/FormButtonsComponent";
import validateEditSchema, {
  validateEditCardParamsSchema,
} from "../validation/editValidation";
import defPic from "../assets/imgs/no-image-icon.png";
import makeALegitStringForImage from "../utils/makeLegitStringForImage";

const EditCardPage = () => {
  const { id } = useParams();
  const [inputState, setInputState] = useState(null);
  const [productPic, setProductPic] = useState("");
  const [disableEd, setDisableEdit] = useState(false);
  const [alertFile, setAlertFile] = useState(false);
  const [fileSize, setFileSize] = useState(0);
  const [inputsErrorsState, setInputsErrorsState] = useState({});
  const navigate = useNavigate();

  const arrOfInputs = [
    { inputName: "Title", idAndKey: "title", isReq: true },
    { inputName: "Description", idAndKey: "description", isReq: true },
    { inputName: "Price", idAndKey: "price", isReq: true },
    { inputName: "Stock", idAndKey: "stock", isReq: true },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const errors = validateEditCardParamsSchema({ id });
        if (errors) {
          navigate("/");
          return;
        }

        const { data } = await axios.get("/cards/card/" + id);
        let newInputState = {
          ...data,
        };
        setProductPic(makeALegitStringForImage(newInputState, "card"));
        delete newInputState.cart;
        delete newInputState.rating;
        delete newInputState.image;
        delete newInputState._id;
        delete newInputState.user_id;
        delete newInputState.createdAt;
        delete newInputState.__v;
        setInputState(newInputState);
        if (!validateEditSchema(newInputState)) {
          setDisableEdit(false);
        }
      } catch (err) {
        if (err && err.response && err.response.data && err.response.data.msg) {
          toast.error(err.response.data.msg);
        } else {
          toast.error("something went wrong, try again later please!");
        }
      }
    };

    fetchData();
  }, []);
  useEffect(() => {
    const joiResponse = validateEditSchema(inputState);
    if (!joiResponse && (!fileSize || fileSize < 1048576)) {
      setInputsErrorsState(joiResponse);
      setDisableEdit(false);
      return;
    }
    setDisableEdit(true);
  }, [fileSize]);

  const handleSaveBtnClick = async (ev) => {
    try {
      const joiResponse = validateEditSchema(inputState);
      setInputsErrorsState(joiResponse);
      if (!joiResponse && fileSize < 1048576) {
        await axios.put("/cards/editcard/" + id, {
          ...inputState,
          image: {
            alt: `${inputState && inputState.title} item pic`,
            imageFile: {
              data: productPic ? productPic : defPic,
              contentType: productPic
                ? `image/${productPic.split(";")[0].split("/")[1]}`
                : "image/png",
            },
          },
        });
        navigate(ROUTES.HOME);
        toast.success("Item updated successfully");
      }
    } catch (err) {
      if (err && err.response && err.response.data && err.response.data.msg) {
        toast.error(err.response.data.msg);
      } else {
        toast.error("something went wrong, try again later");
      }
    }
  };

  const handleInputChange = (ev) => {
    const newInputState = {
      ...inputState,
      [ev.target.id]: ev.target.value,
    };
    setInputState(newInputState);
    const joiResponse = validateEditSchema(newInputState);
    if (!joiResponse && fileSize < 1048576) {
      setInputsErrorsState(joiResponse);
      setDisableEdit(false);
      return;
    }
    setDisableEdit(true);
    const inputKeys = Object.keys(inputState);
    for (const key of inputKeys) {
      if (inputState && !inputState[key] && key !== ev.target.id) {
        if (joiResponse[key]) {
          joiResponse[key] = "";
        }
      }
    }
    setInputsErrorsState(joiResponse);
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
        setProductPic(reader.result);
      };
      reader.readAsDataURL(ev.target.files[0]);
    }
  };
  const handleRemoveImage = () => {
    setAlertFile(false);
    setProductPic("");
    setFileSize(0);
  };

  if (!inputState) {
    return <CircularProgress />;
  }

  return (
    <Container component="main" maxWidth="sm">
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography component="h1" variant="h5">
          Edit card
        </Typography>
        <Box
          component="img"
          sx={{
            maxHeight: { xs: 233, md: 167 },
            maxWidth: { xs: 350, md: 250 },
            mb: 3,
          }}
          alt={inputState.alt ? inputState.alt : ""}
          src={productPic}
        />
        <Grid container spacing={2}>
          {arrOfInputs.map((input) => (
            <Grid item xs={12} sm={6} key={input.inputName}>
              <EditCardPageFieldComponent
                nameOfInput={input.inputName}
                typeofInput={input.idAndKey}
                isReq={input.isReq}
                onInputChange={handleInputChange}
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
            {productPic && (
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
          onRegister={handleSaveBtnClick}
          clickBtnText="Save"
          disableProp={disableEd}
        />
      </Box>
    </Container>
  );
};

export default EditCardPage;
