import React, { useState } from "react";



const WalletConnectComponent = (props) => {
  const [defaultAccount, setDefaultAccount] = useState(null);

  const [message, setMessage] = useState(null);
  const [voterList, setVoterList] = useState([]);

  const accountChangeHandler = (account) => {
    setDefaultAccount(account);
  };

  const connectWalletHandler = () => {
    if (window.ethereum) {
      window.ethereum
        .request({ method: "eth_requestAccounts" })
        .then((result) => {
          accountChangeHandler(result[0]);
          setMessage(null);
          props.contract.getVoterList()
            .then((result) => {
                setVoterList(result);
                console.log(result);
    });
        })
        .catch((err) => setMessage("Conexion rechazada."));
    } else {
      setMessage("Por favor instala Metamask!!");
    }
  };

  function ConnectWalletButton() {
    if (!defaultAccount) {
      return <button onClick={connectWalletHandler}>Connect</button>;
    }
    return null;
  }

  return (
    <div>
      <h3>{"Voting app"}</h3>
      <ConnectWalletButton />
      <h3>Admin address: {defaultAccount}</h3>
      {message}
      <ul>
        {voterList.map(function(item) {
          return <li key={item}>{item}</li>;
        })}
      </ul>
    </div>
  );
};

export default WalletConnectComponent;
