import { TextField } from "@mui/material";
import React, { useState } from "react";

export const TextInput = (setMessage, id) => {
  const [value, setValue] = useState(null);
  const onChangeHandler = (e) => {
    setValue(e.target.value);
    setMessage(null);
  };
  return [
    <TextField id={id} type="text" onChange={onChangeHandler} variant="filled" color="secondary" />,
    value,
  ];
};
