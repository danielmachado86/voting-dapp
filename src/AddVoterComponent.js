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

const VoterList = ({voters}) => {

  let listItems = '';
  if (voters.length > 0){
    listItems = <ul>{voters.map(item => <li key={item}>{item}</li>)}</ul>;
  }
  return listItems;
}

const AddVoterComponent = ({status, contract}) => {

  const [voters, setVoters] = useState([]);
  const [message, setMessage] = useState(null);
  const [Form, formValue] = TextInput(setMessage);

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

  return (
    <div>
      <h3>{"Register voters:"}</h3>
      {Form}
      <button type="submit" onClick={setHandler}>
        Add voter
      </button>
      {message}
      <VoterList voters={voters}/>
    </div>
  );
};

export default AddVoterComponent;
