import React, { useState, useEffect } from "react";
import { TextInput } from "./TextInput";
import { SimpleList } from "./SimpleList";
import { Alert, Button } from "@mui/material";

const AddVoterComponent = ({status, contract}) => {

  const [voters, setVoters] = useState([]);
  const [message, setMessage] = useState(null);
  const [Form, formValue] = TextInput(setMessage, "newVoter");

  useEffect(() =>{
    if (status === 0) {
      contract.getVoterList().then((result) => {
        console.log(result);
          setVoters(result);
      });
    }
  }, [contract, status])

  const setHandler = (event) => {
    event.preventDefault();
    setMessage(null);
    contract
      .addVoter(formValue)
      .then((result) => {
        setMessage("Voter has been added succesfully");
        setVoters(oldArray => [...oldArray, formValue]);
      })
      .catch((error) => {
        if (error.code === 4001) {
          setMessage("User denied transaction signature");
        } else if (error.code === -32603) {
          setMessage("Voter cannot be added twice");
        } else {
          setMessage(error.message);
        }
      });
  };  

  if (status !== 0) {
    return ('');
  }

  return (
    <div>
      <h5>Register voters:</h5>
      {Form}
      <Button type="submit" onClick={setHandler} variant="primary">
        Add voter
      </Button>
      <Alert>{message}</Alert> 
      <SimpleList list={voters}/>
    </div>
  );
};

export default AddVoterComponent;
