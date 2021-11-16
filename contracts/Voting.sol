// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

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
        ProposalRegistrationStartedEnded,
        VotingStarted,
        VotingEnded
    }

    address administrator;
    mapping (address => Voter) voters;
    Proposal[] public proposals;
    ProcessStatus public processStatus;

    constructor () {
        administrator = msg.sender;
        processStatus = ProcessStatus.RegisteringVoters;
    }

    modifier isRegistered(address _address) {
        require(voters[_address].isRegistered, "Voter not registered!!!");
        _;
    }
    function addVoter(address _address) public onlyOwner {
        require(!voters[_address].isRegistered, "Voter already registered!!!");
        voters[_address].isRegistered = true;
    }

    function removeVoter(address _address) public onlyOwner isRegistered(_address) {
        require(voters[_address].isRegistered, "Voter not registered!!!");
        voters[_address].isRegistered = false;
    }

    function addProposal(string memory _name) public isRegistered(msg.sender) {
        proposals.push(Proposal(_name, 0));
    }

}