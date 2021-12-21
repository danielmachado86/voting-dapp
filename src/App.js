import AddVoterComponent from "./AddVoterComponent";

import Voting from "./artifacts/contracts/Voting.sol/Voting.json";
import { useEffect, useState } from "react";
const { ethers } = require("ethers");

const contractAddress = "0x0165878A594ca255338adfa4d48449f69242Eb8F";

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

const ProposalList = ({proposals}) => {

  let listItems = '';
  if (proposals.length > 0){
    listItems = <ul>{proposals.map(item => <li key={item}>{item}</li>)}</ul>;
  }
  return listItems;
}

const ProposalRegistration = ({status, setStatusHandler, Status}) => {

  const [proposals, setProposals] = useState([]);
  const [message, setMessage] = useState(null);


  useEffect(() => {
    switch (status) {
      case 'PROPOSAL_REGISTRATION_STARTED':
        contract.getProposalList().then((result) => {
          setProposals(result);
        });
        break;
        default:
          break;
    }
  }, [status]);


  const submitHandler = (e) => {
    console.log(e.target.proposal.value);
    contract.addProposal(e.target.proposal.value).then(() => {
      setMessage("Proposal has been added succesfully");
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

  if(status === Status.VOTER_REGISTRATION_ENDED){
    return(
    <div>
      <h3>{"Proposal Registration:"}</h3>
      <button onClick={setStatusHandler}>Start</button>
    </div>
    );
  }
  if(status === Status.PROPOSAL_REGISTRATION_STARTED){
    return(
    <div>
      <h3>{"Proposal Registration:"}</h3>
      <form onSubmit={submitHandler}>
        <input id="proposal" type="text" ></input>
        <button type="submit" >Send</button>
      </form>
      <ProposalList proposals={proposals} />
      <button onClick={setStatusHandler} >End</button>
      {message}
    </div>
    );
  }
  return (
    <div>
    </div>
  );
}

function App() {
  
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
          statusHandler();
        })
        .catch((err) => setMessage("Conexion rechazada."));
    } else {
      setMessage("Por favor instala Metamask!!");
    }
  };

  
  const Status = {
    VOTER_REGISTRATION_STARTED:'VOTER_REGISTRATION_STARTED',
    VOTER_REGISTRATION_ENDED:'VOTER_REGISTRATION_ENDED',
    PROPOSAL_REGISTRATION_STARTED:'PROPOSAL_REGISTRATION_STARTED',
    PROPOSAL_REGISTRATION_ENDED:'PROPOSAL_REGISTRATION_ENDED',
    VOTING_STARTED: 'VOTING_STARTED',
    VOTING_ENDED: 'VOTING_ENDED',
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
          setStatus(Status.VOTER_REGISTRATION_ENDED);
          break;
        case 2:
          setStatus(Status.PROPOSAL_REGISTRATION_STARTED);
          break;
        case 3:
          setStatus(Status.PROPOSAL_REGISTRATION_ENDED);
          break;
        case 4:
          setStatus(Status.VOTING_STARTED);
          break;
        case 5:
          setStatus(Status.VOTING_ENDED);
          break;
        case 6:
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
        contract.endVotersRegistration().then((result) => {
          setStatus(Status.VOTER_REGISTRATION_ENDED);
        });
        break;
      case 'VOTER_REGISTRATION_ENDED':
        contract.startProposalRegistration().then((result) => {
          setStatus(Status.PROPOSAL_REGISTRATION_STARTED);
        });
        break;
      case 'PROPOSAL_REGISTRATION_STARTED':
        contract.endProposalRegistration().then((result) => {
          setStatus(Status.PROPOSAL_REGISTRATION_ENDED);
        });
        break;
      case 'PROPOSAL_REGISTRATION_ENDED':
        contract.startVotesRegistration().then((result) => {
          setStatus(Status.VOTING_STARTED);
        });
        break;
      case 'VOTING_STARTED':
        contract.endVotesRegistration().then((result) => {
          setStatus(Status.VOTING_ENDED);
        });
        break;
      case 'VOTING_ENDED':
        contract.tallyVotes().then((result) => {
          setStatus(Status.VOTES_TALLIED);
        })
        .catch((error) => console.log(error));
        break;
      default:
        break;
    };
  };

  const proposalRegistration = ProposalRegistration({status, setStatusHandler, Status});


  useEffect(() => {
    switch (status) {
      case 'VOTER_REGISTRATION_STARTED':
        contract.getVoterList().then((result) => {
          setVoters(result);
        });
        break;
        default:
          break;
    }
  }, [status]);

  return (
    <div className="App">
      <h2>{"Voting app"}</h2>
      <button onClick={connectWalletHandler}>Connect</button>
      <h3>Admin address: {adminAddress}</h3>
      <AddVoterComponent contract={contract} setVoters={setVoters}  status={status} setStatusHandler={setStatusHandler} Status={Status}/>
      <VoterList voters={voters} />
      {proposalRegistration}
      {status}
      {message}

    </div>
  );
}

export default App;
