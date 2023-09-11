import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Alert from "@mui/material/Alert";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ROUTES from "../routes/ROUTES";
import axios from "axios";
import { toast } from "react-toastify";
import defPic from "../assets/imgs/no-image-icon.png";
import validateCreateSchema from "../validation/createCardValidation";
import EditCardPageFieldComponent from "../components/EditCardPageComponent";
import FormButtonsComponent from "../components/FormButtonsComponent";
const CardCreationForm = () => {
  const navigate = useNavigate();
  const [enableEdit, setenableEdit] = useState(true);
  const [inputsErrorsState, setInputsErrorsState] = useState({});
  const [productPic, setProductPic] = useState("");
  const [alertFile, setAlertFile] = useState(false);
  const [fileSize, setFileSize] = useState(0);
  const [inputState, setInputState] = useState({
    title: "",
    description: "",
    price: "",
    stock: "",
  });
  useEffect(() => {
    const joiResponse = validateCreateSchema(inputState);
    if (!joiResponse && (!fileSize || fileSize < 1048576)) {
      setInputsErrorsState(joiResponse);
      setenableEdit(false);
      return;
    }
    setenableEdit(true);
  }, [fileSize]);

  const arrOfInputs = [
    { inputName: "Title", idAndKey: "title", isReq: true },
    { inputName: "Description", idAndKey: "description", isReq: true },
    { inputName: "Price", idAndKey: "price", isReq: true },
    { inputName: "Stock", idAndKey: "stock", isReq: true },
  ];
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

  const handleSaveBtnClick = async (event) => {
    try {
      const joiResponse = validateCreateSchema(inputState);
      setInputsErrorsState(joiResponse);
      if (!joiResponse) {
        await axios.post("/cards/card/", {
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
        toast.success("Item created successfully!");
      }
    } catch (error) {
      toast.error("Failed to create card. Please try again later.");
    }
  };

  const handleCancelBtnClick = (ev) => {
    navigate(ROUTES.HOME);
  };
  const handleInputChange = (ev) => {
    let newInputState = JSON.parse(JSON.stringify(inputState));
    newInputState[ev.target.id] = ev.target.value;

    setInputState(newInputState);
    const joiResponse = validateCreateSchema(newInputState);
    if (!joiResponse && fileSize < 1048576) {
      setInputsErrorsState(joiResponse);
      setenableEdit(false);
      return;
    }
    const inputKeys = Object.keys(inputState);
    for (const key of inputKeys) {
      if (inputState && !inputState[key] && key !== ev.target.id) {
        joiResponse[key] = "";
      }
    }
    setInputsErrorsState(joiResponse);
    setenableEdit(true);
  };
  const handleClearClick = () => {
    const cloneInputState = JSON.parse(JSON.stringify(inputState));
    const inputKeys = Object.keys(cloneInputState);
    for (const key of inputKeys) {
      if (typeof cloneInputState[key] === "string") {
        cloneInputState[key] = "";
      }
    }
    setInputsErrorsState(null);
    setInputState(cloneInputState);
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {productPic ? (
          <img
            src={productPic}
            alt="asda"
            style={{
              margin: 1,
              backgroundColor: "secondary.main",
              maxWidth: "300px",
              maxHeight: "300px",
            }}
          />
        ) : (
          ""
        )}
        <Typography sx={{ m: 3 }} component="h1" variant="h5">
          Create Card Page
        </Typography>
        <br></br>
        <Grid container spacing={2}>
          {arrOfInputs.map((input) => (
            <Grid item xs={12} sm={6} key={input.inputName}>
              <EditCardPageFieldComponent
                nameOfInput={input.inputName}
                typeofInput={input.idAndKey}
                isReq={input.isReq}
                onInputChange={handleInputChange}
              />
              {inputsErrorsState &&
                inputsErrorsState[input.idAndKey] &&
                !inputsErrorsState[input.idAndKey].find(
                  (item) => item && item.includes("is not allowed to be empty")
                ) && (
                  <Alert
                    variant="filled"
                    severity="error"
                    sx={{ marginTop: "0.2rem" }}
                  >
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
          onCancel={handleCancelBtnClick}
          onReset={handleClearClick}
          onRegister={handleSaveBtnClick}
          clickBtnText="Save"
          disableProp={enableEdit}
        />
      </Box>
    </Container>
  );
};
export default CardCreationForm;
