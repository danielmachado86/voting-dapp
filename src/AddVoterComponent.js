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

const VoterList = () => {
  const [voters, setVoters] = useState([]);

  let listItems = '';
  if (voters.length > 0){
    listItems = <ul>{voters.map(item => <li key={item}>{item}</li>)}</ul>;
  }
  return [
    listItems,
    setVoters
  ];
}

const AddVoterComponent = (contract) => {
  const [message, setMessage] = useState(null);

  const [Form, formValue] = TextInput(setMessage);
  const [voterList, setVoters] = VoterList();

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

  return [
    <div>
      {voterList}
      {Form}
      <button type="submit" onClick={setHandler}>
        Add voter
      </button>
      {message}
    </div>,
    setVoters
  ];
};

export default AddVoterComponent;
