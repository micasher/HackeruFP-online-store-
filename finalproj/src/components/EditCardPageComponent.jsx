import { InputAdornment, TextField } from "@mui/material";
import React from "react";

const EditCardPageFieldComponent = ({
  nameOfInput,
  typeofInput,
  isReq,
  onInputChange,
  value,
}) => {
  const handleInputChange = (ev) => {
    onInputChange(ev);
  };

  return (
    <TextField
      name={nameOfInput}
      required={isReq}
      fullWidth
      multiline={typeofInput == "description" ? true : false}
      InputProps={{
        startAdornment:
          typeofInput == "price" ? (
            <InputAdornment position="start">$</InputAdornment>
          ) : (
            ""
          ),
      }}
      id={typeofInput}
      label={nameOfInput}
      value={value}
      onChange={handleInputChange}
    />
  );
};

export default EditCardPageFieldComponent;
