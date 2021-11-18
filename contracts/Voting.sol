// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/access/Ownable.sol";

contract Voting is Ownable{

    struct Proposal {
        string name;
        uint voteCount;
    }

    struct Voter {
        bool isRegistered;
        bool hasVoted;
        uint votedProposalId;
    }

    enum ProcessStatus {
        RegisteringVoters,
        ProposalRegistrationStarted,
        ProposalRegistrationEnded,
        VotingStarted,
        VotingEnded
    }

    address administrator;
    mapping (address => Voter) public voters;
    Proposal[] public proposals;
    ProcessStatus public processStatus;

    constructor () {
        processStatus = ProcessStatus.RegisteringVoters;
    }

    modifier isRegistered(address _address) {
        require(voters[_address].isRegistered, "Voter not registered!!!");
        _;
    }

    modifier isRegisteringVoters() {
        require(processStatus == ProcessStatus.RegisteringVoters, "Process must be in voters registration phase!!!");
        _;
    }

    modifier isRegisteringProposals() {
        require(processStatus == ProcessStatus.ProposalRegistrationStarted, "Process must be in voters registration phase!!!");
        _;
    }
    function addVoter(address _address) public onlyOwner isRegisteringVoters {
        require(!voters[_address].isRegistered, "Voter already registered!!!");
        voters[_address].isRegistered = true;
        voters[_address].hasVoted = false;
        voters[_address].votedProposalId = 0;
    }

    function removeVoter(address _address) public onlyOwner isRegisteringVoters isRegistered(_address) {
        voters[_address].isRegistered = false;
        voters[_address].hasVoted = false;
        voters[_address].votedProposalId = 0;
    }

    function startProposalRegistration() public onlyOwner {
        processStatus = ProcessStatus.ProposalRegistrationStarted;
    }

    function addProposal(string memory _name) public isRegisteringProposals isRegistered(msg.sender) {
        proposals.push(Proposal(_name, 0));
    }

    function endProposalRegistration() public onlyOwner {
        processStatus = ProcessStatus.ProposalRegistrationEnded;
    }

    function startVotesRegistration() public onlyOwner {
        processStatus = ProcessStatus.VotingStarted;
    }

}