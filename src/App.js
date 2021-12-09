import AddVoterComponent from "./AddVoterComponent";

import Voting from "./artifacts/contracts/Voting.sol/Voting.json";
import { useEffect, useState } from "react";
const { ethers } = require("ethers");

const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

const provider = new ethers.providers.Web3Provider(window.ethereum);
const signer = provider.getSigner();
const contract = new ethers.Contract(contractAddress, Voting.abi, signer);

const VoterList = ({voters}) => {

  let listItems = '';
  if (voters.length > 0){
    listItems = <ul>{voters.map(item => <li key={item}>{item}</li>)}</ul>;
  }
  return listItems;
}

function App() {
  
  const [connected, setConnected] = useState(false);
  const [voters, setVoters] = useState([]);
  const [adminAddress, setAdminAddress] = useState(null);
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
        })
        .catch((err) => setMessage("Conexion rechazada."));
    } else {
      setMessage("Por favor instala Metamask!!");
    }
  };

  useEffect(() => {
    if(connected){
      contract.getVoterList().then((result) => {
        setVoters(result);
        console.log(result);
        });
    }
  }, [connected]);
      

  const State = () => {
    
  }

  return (
    <div className="App">
      <h3>{"Voting app"}</h3>
      <button onClick={connectWalletHandler}>Connect</button>
      <h3>Admin address: {adminAddress}</h3>
      <AddVoterComponent contract={contract} setVoters={setVoters} />
      <VoterList voters={voters} />
      {message}

    </div>
  );
}

export default App;
