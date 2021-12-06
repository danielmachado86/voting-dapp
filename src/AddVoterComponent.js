import React, {useState} from "react";
import Voting from './artifacts/contracts/Voting.sol/Voting.json';
const { ethers } = require("ethers");

const contractAddress = '0x5FbDB2315678afecb367f032d93F642f64180aa3';

const provider = new ethers.providers.Web3Provider(window.ethereum);
const signer = provider.getSigner();
const contract = new ethers.Contract(contractAddress, Voting.abi, signer);

const VoterList = () => {
  const [voterList, setVoterList] = useState([]);

  contract.getVoterList()
  .then((result) => {
    console.log(result);
  });
  return (
    <ul>
      <li>{voterList[0]}</li>
      <li>{voterList[1]}</li>
      <li>{voterList[2]}</li>
      <li>{voterList[3]}</li>
    </ul>
  );
}

const TextInput = (setMessage) => {
  const [voterAddress, setVoterAddress] = useState(null);
  const onChangeHandler = (event) => {
    setVoterAddress(event.target.value);
    setMessage(null);
  };
  return [
      <input
        id="newVoter"
        type="text"
        onChange={onChangeHandler}
      />,
      voterAddress
  ];
}

const AddVoterComponent = () => {



  const [message, setMessage] = useState(null);

  const [Form, formValue] = TextInput(setMessage);

  const list = VoterList();
  
  const setHandler = (event) => {
    event.preventDefault();
    setMessage(null);
    contract
    .addVoter(formValue)
    .then((result) => {
      setMessage("Voter has been added succesfully");
    })
    .catch((error) => {
      if(error.code === 4001) {
        setMessage("User denied transaction signature");
      } else if (error.code === -32603){
        setMessage("Voter cannot be added twice");
      } else {
        setMessage(error.message);
      }
    });
  }

  return (
    <div>
      {Form}
      <button type='submit' onClick={setHandler}>Add voter</button>
      {list}
      {message}
    </div>
  );
}

export default AddVoterComponent;
