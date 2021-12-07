import React, { useState } from "react";

const TextInput = (setMessage) => {
  const [voterAddress, setVoterAddress] = useState(null);
  const onChangeHandler = (event) => {
    setVoterAddress(event.target.value);
    setMessage(null);
  };
  return [
    <input id="newVoter" type="text" onChange={onChangeHandler} />,
    voterAddress,
  ];
};

const AddVoterComponent = (props) => {
  const [message, setMessage] = useState(null);

  const [Form, formValue] = TextInput(setMessage);

  const setHandler = (event) => {
    event.preventDefault();
    setMessage(null);
    props.contract
      .addVoter(formValue)
      .then((result) => {
        setMessage("Voter has been added succesfully");
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

  return (
    <div>
      {Form}
      <button type="submit" onClick={setHandler}>
        Add voter
      </button>
      {message}
    </div>
  );
};

export default AddVoterComponent;