import AddVoterComponent from "./AddVoterComponent";
import { useEffect, useState } from "react";
import { ProposalRegistration } from "./ProposalRegistration";
import { VerticalLinearStepper } from "./VerticalLinearStepper";


export const StatusManager = ({ connected, contract }) => {
  const Status = {
    0: "VOTER_REGISTRATION_STARTED",
    1: "VOTER_REGISTRATION_ENDED",
    2: "PROPOSAL_REGISTRATION_STARTED",
    3: "PROPOSAL_REGISTRATION_ENDED",
    4: "VOTING_STARTED",
    5: "VOTING_ENDED",
    6: "VOTES_TALLIED",
  };

  const [status, setStatus] = useState(null);

  useEffect(() => {
    if (connected) {
      contract.processStatus().then((result) => {
        setStatus(result);
      });
    }
  }, [connected, contract]);

  const setStatusHandler = () => {
    switch (status) {
      case 0:
        contract.endVotersRegistration().then(() => {
          setStatus(1);
        });
        break;
      case 1:
        contract.startProposalRegistration().then((result) => {
          setStatus(2);
        });
        break;
      case 2:
        contract.endProposalRegistration().then((result) => {
          setStatus(3);
        });
        break;
      case 3:
        contract.startVotesRegistration().then((result) => {
          setStatus(4);
        });
        break;
      case 4:
        contract.endVotesRegistration().then((result) => {
          setStatus(5);
        });
        break;
      case 5:
        contract.tallyVotes().then((result) => {
          setStatus(6);
        });
        break;
      default:
        break;
    }
  };

  return (
    <div>
      <VerticalLinearStepper status={status} setStatusHandler={setStatusHandler}/>
      {Status[status]}
      <button onClick={setStatusHandler}>Next</button>
      <AddVoterComponent status={status} contract={contract} />
      <ProposalRegistration status={status} contract={contract} />
    </div>
  );
};
