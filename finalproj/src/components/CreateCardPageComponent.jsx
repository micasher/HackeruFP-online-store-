import { TextField } from "@mui/material";
import React from "react";

const CreateCardPageComponent = ({
  nameOfInput,
  typeofInput,
  isReq,
  onInputeChange,
  value,
}) => {
  const handleInputChange = () => {
    onInputeChange();
  };

  return (
    <TextField
      name={nameOfInput}
      required={isReq}
      id={typeofInput}
      label={nameOfInput}
      value={value}
      onChange={onInputeChange}
    />
  );
};

export default CreateCardPageComponent;
