import React, {useState} from "react";
import Voting from '../artifacts/contracts/Voting.sol/Voting.json'
const { ethers } = require("ethers");


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
      return(<button onClick={connectWalletHandler}>Connect</button>);
    }
    return(null);
  }

  return (
    <div>
        <h3>{"Voting app"}</h3>
        <ConnectWalletButton/>
        <h3>Address: {defaultAccount}</h3>

        {errorMessage}
    </div>
  );
}

export default VotingComponent;
