import AddVoterComponent from "./AddVoterComponent";

import Voting from "./artifacts/contracts/Voting.sol/Voting.json";
import { useEffect, useState } from "react";
const { ethers } = require("ethers");

const contractAddress = "0xa85233C63b9Ee964Add6F2cffe00Fd84eb32338f";

const provider = new ethers.providers.Web3Provider(window.ethereum);
const signer = provider.getSigner();

const ProposalList = ({proposals}) => {

  let listItems = '';
  if (proposals.length > 0){
    listItems = <ul>{proposals.map(item => <li key={item}>{item}</li>)}</ul>;
  }
  return listItems;
}

const ProposalRegistration = ({status, contract}) => {

  const [proposals, setProposals] = useState([]);
  const [message, setMessage] = useState(null);


  useEffect(() => {
      if(status === 2){
        contract.getProposalList().then((result) => {
          setProposals(result);
        });
      }
  }, [contract, status]);


  const submitHandler = (e) => {
    e.preventDefault();
    console.log(e.target.proposal.value);
    contract.addProposal(e.target.proposal.value).then(() => {
      setMessage("Proposal has been added succesfully");
      setProposals(oldArray => [...oldArray, formValue]);

    })
    .catch((error) => {
      if (error.code === 4001) {
        setMessage("User denied transaction signature");
      } else if (error.code === -32603) {
        setMessage("Proposal cannot be added twice");
      } else {
        setMessage(error.message);
      };
    });
  };

  if (status !== 2) {
    return (<div></div>);
  }

  return(
  <div>
    <h3>{"Proposal Registration:"}</h3>
    <form onSubmit={submitHandler}>
      <input id="proposal" type="text" ></input>
      <button type="submit" >Send</button>
    </form>
    <ProposalList proposals={proposals} />
    {message}
  </div>
  );
}

const WalletConnection = ({contract}) => {

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
        .catch((err) => setMessage("Conexion rechazada."));
    } else {
      setMessage("Por favor instala Metamask!!");
    }
  };

  return (
    <div>
      <button onClick={connectWalletHandler}>Connect</button>
      <h3>Admin address: {adminAddress}</h3>
      {message}
      <StatusManager connected={connected} contract={contract} />
    </div>
  );

};

const StatusManager = ({connected, contract}) => {

  const Status = {
    0:'VOTER_REGISTRATION_STARTED',
    1:'VOTER_REGISTRATION_ENDED',
    2:'PROPOSAL_REGISTRATION_STARTED',
    3:'PROPOSAL_REGISTRATION_ENDED',
    4: 'VOTING_STARTED',
    5: 'VOTING_ENDED',
    6: 'VOTES_TALLIED'
  };

  const [status, setStatus] = useState(null);

  useEffect((up) =>{
    if(connected){
      contract.processStatus().then((result) => {
        console.log(result);
          setStatus(result);
      });
    }
  }, [connected, contract])


  const setStatusHandler = () => {
    // console.log(status);
    switch (status) {
      case 0:
        contract.endVotersRegistration().then((result) => {
          setStatus(status+1);
        });
        break;
      case 1:
        contract.startProposalRegistration().then((result) => {
          setStatus(status+1);
        });
        break;
      case 2:
        contract.endProposalRegistration().then((result) => {
          setStatus(status+1);
        });
        break;
      case 3:
        contract.startVotesRegistration().then((result) => {
          setStatus(status+1);
        });
        break;
      case 4:
        contract.endVotesRegistration().then((result) => {
          setStatus(status+1);
        });
        break;
      case 5:
        contract.tallyVotes().then((result) => {
          setStatus(status+1);
        })
        break;
      default:
        break;
    };
  };

  return (
    <div>
      {Status[status]}
      <button onClick={setStatusHandler}>Next</button> 
      <AddVoterComponent status={status} contract={contract} />
      <ProposalRegistration status={status} contract={contract} />
    </div>
  );
};

function App() {

  const contract = new ethers.Contract(contractAddress, Voting.abi, signer);

  return (
    <div className="App">
      <h2>{"Voting app"}</h2>
      <WalletConnection contract={contract} />
    </div>
  );
}

export default App;
