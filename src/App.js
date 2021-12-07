import AddVoterComponent from "./AddVoterComponent";
import WalletConnectComponent from "./WalletConnectComponent";

import Voting from "./artifacts/contracts/Voting.sol/Voting.json";
import { useState } from "react";
const { ethers } = require("ethers");

const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

const provider = new ethers.providers.Web3Provider(window.ethereum);
const signer = provider.getSigner();
const contract = new ethers.Contract(contractAddress, Voting.abi, signer);


function App() {

  const [connected, setConnected] = useState(false);


  if(connected) {
    contract.getVoterList().then((result) => {
      console.log(result);
      });
  }
  
  return (
    <div className="App">
      <WalletConnectComponent setConnected={setConnected} contract={contract} />
      <AddVoterComponent connected={connected} contract={contract} />
    </div>
  );
}

export default App;
