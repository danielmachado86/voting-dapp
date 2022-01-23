import { useState } from "react";
import { StatusManager } from "./StatusManager";

export const WalletConnection = ({ contract }) => {

  const [adminAddress, setAdminAddress] = useState(null);
  const [message, setMessage] = useState(null);
  const [connected, setConnected] = useState(false);


  const accountChangeHandler = (account) => {
    setAdminAddress(account);
  };

  const connectWalletHandler = () => {
    if (window.ethereum) {
      window.ethereum
        .request({ method: "eth_requestAccounts" })
        .then((result) => {
          accountChangeHandler(result[0]);
          setConnected(true);
          setMessage(null);
        })
        .catch((error) => setMessage("Conexion rechazada."));
    } else {
      setMessage("Por favor instala Metamask!!");
    }
  };

  return (
    <div>
      <button onClick={connectWalletHandler}>Connect</button>
      <h5>Admin address: {adminAddress}</h5>
      {message}
      <StatusManager connected={connected} contract={contract} />
    </div>
  );

};
