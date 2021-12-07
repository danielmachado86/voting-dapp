import React, { useState } from "react";

const WalletConnectComponent = (contract, setVoters) => {
  const [adminAddress, setAdminAddress] = useState(null);
  const [connected, setConnected] = useState(false);

  const [message, setMessage] = useState(null);

  const accountChangeHandler = (account) => {
    setAdminAddress(account);
  };

  const connectWalletHandler = () => {
    if (window.ethereum) {
      window.ethereum
        .request({ method: "eth_requestAccounts" })
        .then((result) => {
          accountChangeHandler(result[0]);
          setMessage(null);
          setConnected(true);
          contract.getVoterList().then((result) => {
          setVoters(result);
          console.log(result);
          });
        })
        .catch((err) => setMessage("Conexion rechazada."));
    } else {
      setMessage("Por favor instala Metamask!!");
    }
  };

  return [
    <div>
      <h3>{"Voting app"}</h3>
      <button onClick={connectWalletHandler}>Connect</button>
      <h3>Admin address: {adminAddress}</h3>
      {message}
    </div>
  ];
};

export default WalletConnectComponent;
