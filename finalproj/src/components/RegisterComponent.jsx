import { TextField } from "@mui/material";
import React from "react";

const RegisterFieldComponent = ({
  nameOfInput,
  typeofInput,
  isReq,
  onInputeChange,
  value,
}) => {
  const handleInputChange = () => {
    onInputeChange();
  };
  if (typeofInput === "password") {
    return (
      <TextField
        type="password"
        name={nameOfInput}
        required={isReq}
        fullWidth
        id={typeofInput}
        label={nameOfInput}
        autoFocus
        value={value}
        onChange={onInputeChange}
      />
    );
  }
  return (
    <TextField
      name={nameOfInput}
      required={isReq}
      fullWidth
      id={typeofInput}
      label={nameOfInput}
      value={value}
      onChange={onInputeChange}
    />
  );
};

export default RegisterFieldComponent;
