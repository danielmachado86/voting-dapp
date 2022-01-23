
import Voting from "./artifacts/contracts/Voting.sol/Voting.json";
import { WalletConnection } from "./components/WalletConnection";
// import './App.css';

import '@fontsource/roboto/300.css';

const { ethers } = require("ethers");

const contractAddress = "0x9A676e781A523b5d0C0e43731313A708CB607508";

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
