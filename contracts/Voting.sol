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
        VotingEnded,
        VotesTallied
    }

    address public administrator;
    mapping (address => Voter) public voters;
    Proposal[] public proposals;
    ProcessStatus public processStatus;
    uint private winningProposalId;

    event VoterRegisteredEvent (address voterAddress); 
    event ProposalsRegistrationStartedEvent ();
    event ProposalsRegistrationEndedEvent ();
    event ProposalRegisteredEvent(uint proposalId);
    event VotingSessionStartedEvent ();
    event VotingSessionEndedEvent ();
    event VotedEvent (address voter, uint proposalId);
    event VotesTalliedEvent ();

    event WorkflowStatusChangeEvent (
        ProcessStatus previousStatus, 
        ProcessStatus newStatus
    );
    constructor () {
        processStatus = ProcessStatus.RegisteringVoters;
    }

    modifier isRegistered(address _address) {
        require(voters[_address].isRegistered, "Voter not registered!!!");
        _;
    }

    modifier onlyDuringVotersRegistration() {
        require(processStatus == ProcessStatus.RegisteringVoters, "Process must be in voters registration phase!!!");
        _;
    }

    modifier isRegisteringProposals() {
        require(processStatus == ProcessStatus.ProposalRegistrationStarted, "Process must be in voters registration phase!!!");
        _;
    }

    modifier isRegisteringProposalsEnded() {
        require(processStatus == ProcessStatus.ProposalRegistrationEnded, "Voters registration must be finished!!!");
        _;
    }

    modifier isRegisteringVotes() {
        require(processStatus == ProcessStatus.VotingStarted, "Process must be in voting registration phase!!!");
        _;
    }

    modifier isRegisteringVotesEnded() {
        require(processStatus == ProcessStatus.VotingEnded, "Voting registration phase must be ended!!!");
        _;
    }

    function addVoter(address _address) public onlyOwner onlyDuringVotersRegistration {
        require(!voters[_address].isRegistered, "Voter already registered!!!");
        voters[_address].isRegistered = true;
        voters[_address].hasVoted = false;
        voters[_address].votedProposalId = 0;

        emit VoterRegisteredEvent(_address);
    }

    function removeVoter(address _address) public onlyOwner onlyDuringVotersRegistration isRegistered(_address) {
        voters[_address].isRegistered = false;
        voters[_address].hasVoted = false;
        voters[_address].votedProposalId = 0;
    }

    function startProposalRegistration() public onlyOwner {
        processStatus = ProcessStatus.ProposalRegistrationStarted;

        emit ProposalsRegistrationStartedEvent ();

    }

    function addProposal(string memory _name) public isRegisteringProposals isRegistered(msg.sender) {
        proposals.push(Proposal(_name, 0));

        emit ProposalRegisteredEvent(proposals.length - 1 );

    }

    function endProposalRegistration() public onlyOwner isRegisteringProposals {
        processStatus = ProcessStatus.ProposalRegistrationEnded;
        emit ProposalsRegistrationEndedEvent ();

    }

    function startVotesRegistration() public onlyOwner isRegisteringProposalsEnded {
        processStatus = ProcessStatus.VotingStarted;

        emit VotingSessionStartedEvent ();

    }

    function addVote(uint _proposalId) public isRegisteringVotes isRegistered(msg.sender) {
        require(!voters[msg.sender].hasVoted, "Participants can vote just one time!!");
        proposals[_proposalId].voteCount++;
        voters[msg.sender].hasVoted = true;
        voters[msg.sender].votedProposalId = _proposalId;

        emit VotedEvent (msg.sender, _proposalId);


    }

    function endVotesRegistration() public onlyOwner isRegisteringVotes {
        processStatus = ProcessStatus.VotingEnded;
        
        emit VotingSessionEndedEvent ();

    }

    function tallyVotes() public onlyOwner isRegisteringVotesEnded {
        uint i = 0;
        uint winningProposalIndex = 0;
        uint winningVoteCount = 0;

        for(i=0; i<=proposals.length-1; i++) {
            if (proposals[i].voteCount > winningVoteCount) {
                winningVoteCount = proposals[i].voteCount;
                winningProposalIndex = i;
            }
        }

        winningProposalId = winningProposalIndex;
        processStatus = ProcessStatus.VotesTallied;
    }

}