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
  const [status, setStatus] = useState(null);
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

  
  const Status = {
    VOTER_REGISTRATION_STARTED:'VOTER_REGISTRATION_STARTED',
    PROPOSAL_REGISTRATION_STARTED:'PROPOSAL_REGISTRATION_STARTED',
    VOTING_STARTED: 'VOTING_STARTED',
    VOTES_TALLIED: 'VOTES_TALLIED'
  }

  const statusHandler = () => {
    contract.processStatus().then((result) => {
      console.log(result);
      switch (result) {
        case 0:
          setStatus(Status.VOTER_REGISTRATION_STARTED);
          break;
        case 1:
          setStatus(Status.PROPOSAL_REGISTRATION_STARTED);
          break;
        case 2:
          setStatus(Status.VOTING_STARTED);
          break;
        case 3:
          setStatus(Status.VOTES_TALLIED);
          break;
        default:
          break;
      };
    });
  };

  const setStatusHandler = () => {
    console.log(status);
    switch (status) {
      case 'VOTER_REGISTRATION_STARTED':
        contract.startProposalRegistration().then((result) => {
          setStatus(Status.PROPOSAL_REGISTRATION_STARTED);
        });
        break;
      case 'PROPOSAL_REGISTRATION_STARTED':
        contract.startVotesRegistration().then((result) => {
          setStatus(Status.VOTING_STARTED);
        });
        break;
      case 'VOTING_STARTED':
        contract.endtVotesRegistration().then((result) => {
          setStatus(Status.VOTES_TALLIED);
        });
        break;
      default:
        break;
    };
  };

  useEffect(() => {
    if(connected){
      contract.getVoterList().then((result) => {
        setVoters(result);
        console.log(result);
      });
    statusHandler();
    }
  }, [connected]);

  return (
    <div className="App">
      <h2>{"Voting app"}</h2>
      <button onClick={connectWalletHandler}>Connect</button>
      <h3>Admin address: {adminAddress}</h3>
      <h3>{"Register voters:"}</h3>
      <AddVoterComponent contract={contract} setVoters={setVoters} />
      <VoterList voters={voters} />
      <h3>{"Proposal Registration:"}</h3>
      <button onClick={setStatusHandler}>Start</button>
      {status}
      {message}

    </div>
  );
}

export default App;
