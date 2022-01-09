
import Voting from "./artifacts/contracts/Voting.sol/Voting.json";
import { WalletConnection } from "./WalletConnection";
import './App.css';

import '@fontsource/roboto/300.css';

const { ethers } = require("ethers");

const contractAddress = "0x4ed7c70F96B99c776995fB64377f0d4aB3B0e1C1";

const provider = new ethers.providers.Web3Provider(window.ethereum);
const signer = provider.getSigner();

function App() {

  const contract = new ethers.Contract(contractAddress, Voting.abi, signer);

  return (
    <div className="App">
      <header className="App-header">
        <h4>Voting app</h4>
        <WalletConnection contract={contract} />
      </header>
      
    </div>
  );
}

export default App;
