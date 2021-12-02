import React, {useState} from "react";
const { ethers } = require("ethers");



const VotingComponent = () => {
    
    const [defaultAccount, setDefaultAccount] = useState(null);
    
    const accountChangeHandler = (account) => {
        setDefaultAccount(account);
    }
    
    const connectWalletHandler = () => {
      if(window.ethereum){
        window.ethereum.request({method: 'eth_requestAccounts'})
          .then(result => {
            accountChangeHandler(result[0]);
    
          })
      } else {
        
      }
    }

  return (
    <div>
        <h3>{"Voting app"}</h3>
        <button onClick={connectWalletHandler}>Connect</button>
        <h3>Address: {defaultAccount}</h3>
    </div>
  );
}

export default VotingComponent;
