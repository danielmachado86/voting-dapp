import { TextInput } from "./TextInput";
import { SimpleList } from "./SimpleList";
import { useEffect, useState } from "react";
import { Alert, Button } from "@mui/material";

export const ProposalRegistration = ({ status, contract }) => {

  const [proposals, setProposals] = useState([[]]);
  const [message, setMessage] = useState(null);
  const [Form, formValue] = TextInput(setMessage, "newProposal");


  useEffect(() => {
    if (status === 2) {
      let proposals = [];
      contract.getProposalList().then((result) => {
        for (let index = 0; index < result.length; index++) {
          proposals[index] = result[index]['name'];
        }
        console.log(result);
        console.log(proposals);
        setProposals(proposals);
      });
    }
  }, [contract, status]);


  const submitHandler = (e) => {
    // e.preventDefault();
    contract.addProposal(formValue).then(() => {
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

  return (
    <div>
      <h5>Proposal Registration:</h5>
      {Form}
      <Button type="submit" onClick={submitHandler} size="small" variant="outlined" color="secondary">
        Add proposal
      </Button>
      <Alert>{message}</Alert> 
      <SimpleList list={proposals} />
    </div>
  );
};
