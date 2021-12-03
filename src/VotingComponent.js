import React, {useState} from "react";
import Voting from './artifacts/contracts/Voting.sol/Voting.json';
const { ethers } = require("ethers");

const contractAddress = '0x5FbDB2315678afecb367f032d93F642f64180aa3';

const provider = new ethers.providers.Web3Provider(window.ethereum);
const signer = provider.getSigner();
const contract = new ethers.Contract(contractAddress, Voting.abi, signer);

const VotingComponent = () => {
    
  const [defaultAccount, setDefaultAccount] = useState(null);

  const [errorMessage, setErrorMessage] = useState(null);
  
  const accountChangeHandler = (account) => {
    setDefaultAccount(account);
  }
  
  const connectWalletHandler = () => {
    if(window.ethereum){
      window.ethereum.request({method: 'eth_requestAccounts'})
        .then(result => {
          accountChangeHandler(result[0]);
          setErrorMessage(null);
          
        })
        .catch(err => setErrorMessage("Conexion rechazada."));
    } else {
      setErrorMessage("Por favor instala Metamask!!");
    }
  }

  function ConnectWalletButton() {
    if(!defaultAccount) {
      return(
        <button onClick={connectWalletHandler}>Connect</button>
      );
    }
    return(null);
  }

  const setHandler = (event) => {
    event.preventDefault();
    contract.addVoter(event.target.newVoter.value);
  }

  function AddVoterForm() {
    if(defaultAccount){
      return(
        <form onSubmit={setHandler}>
          <input id='newVoter' type='text'></input>
          <button type='submit'>Add voter</button>
        </form>
      );
    }
    return(null);
  }

  return (
    <div>
        <h3>{"Voting app"}</h3>
        <ConnectWalletButton/>
        <h3>Address: {defaultAccount}</h3>
        <AddVoterForm/>
        {errorMessage}
    </div>
  );
}

export default VotingComponent;
