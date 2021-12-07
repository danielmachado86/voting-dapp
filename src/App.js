import AddVoterComponent from "./AddVoterComponent";
import WalletConnectComponent from "./WalletConnectComponent";

import Voting from "./artifacts/contracts/Voting.sol/Voting.json";
const { ethers } = require("ethers");

const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

const provider = new ethers.providers.Web3Provider(window.ethereum);
const signer = provider.getSigner();
const contract = new ethers.Contract(contractAddress, Voting.abi, signer);


function App() {

  const [addVoterComponent, setVoters] = AddVoterComponent(contract);
  const [walletConnectComponent] = WalletConnectComponent(contract, setVoters);
  
  return (
    <div className="App">
      {walletConnectComponent}
      {addVoterComponent}
    </div>
  );
}

export default App;
