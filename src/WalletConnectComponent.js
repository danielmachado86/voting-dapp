import React, {useState} from "react";

const WalletConnectComponent = () => {
    
  const [defaultAccount, setDefaultAccount] = useState(null);

  const [message, setMessage] = useState(null);
  
  const accountChangeHandler = (account) => {
    setDefaultAccount(account);
  }
  
  const connectWalletHandler = () => {
    if(window.ethereum){
      window.ethereum.request({method: 'eth_requestAccounts'})
        .then(result => {
          accountChangeHandler(result[0]);
          setMessage(null);
        })
        .catch(err => setMessage("Conexion rechazada."));
    } else {
      setMessage("Por favor instala Metamask!!");
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

  return (
    <div>
        <h3>{"Voting app"}</h3>
        <ConnectWalletButton/>
        <h3>Address: {defaultAccount}</h3>
        {message}
    </div>
  );
}

export default WalletConnectComponent;
