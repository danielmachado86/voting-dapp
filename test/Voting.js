const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Voting contract", () => {
  let Voting, voting, admin, addr1, addr2;
  const processStatus = {
    RegisteringVoters: 0,
    ProposalRegistrationStarted: 1,
    ProposalRegistrationEnded: 2,
    VotingStarted: 3,
    VotingEnded: 4,
  };

  beforeEach(async () => {
    Voting = await ethers.getContractFactory("Voting");
    voting = await Voting.deploy();
    [admin, addr1, addr2, addr3, _] = await ethers.getSigners();
  });

  describe("Deployment", () => {
    it("Should set the calling account as admin", async () => {
      expect(await voting.owner()).to.equal(admin.address);
    });
    it("Should set initial status", async () => {
      expect(await voting.processStatus()).to.equal(
        processStatus.RegisteringVoters
      );
    });
  });

  describe("Checking admin permissions for registering voters", () => {
    it("Should reject regular/user account", async () => {
      await expect(voting.connect(addr1).addVoter(addr2.address)).to.be
        .reverted;
    });
    it("Should allow to register voter", async () => {
      await expect(voting.addVoter(addr1.address)).not.to.be.reverted;
      const voter = await voting.voters(addr1.address);
      expect(voter.isRegistered).to.be.true;
      expect(voter.hasVoted).to.be.false;
      expect(voter.votedProposalId).to.equal(0);
    });
  });
  describe("Contract administrator registering voters", () => {
    beforeEach(async () => {
      await voting.addVoter(addr1.address);
    });
    
    it("Should not allow to register an existing voter", async () => {
      let voter = await voting.voters(addr1.address);
      expect(voter.isRegistered).to.be.true;
      await expect(voting.addVoter(addr1.address)).to.be.reverted;
    });
    it ("Should register a voter", async () => {
      await voting.addVoter(addr2.address);
      let voter = await voting.voters(addr2.address);
      expect(voter.isRegistered).to.be.true;
      let voterId = voter.voterId;
      expect(voterId).equal(1);
      const voterList = await voting.getVoterList();
      expect(voterList.length).equal(2);
    });
    it("Should remove voter", async () => {
      await voting.removeVoter(addr1.address);
      const voter = await voting.voters(addr1.address);
      expect(voter.isRegistered).to.be.false;
      expect(voter.hasVoted).to.be.false;
      expect(voter.votedProposalId).to.equal(0);
    });
  });

  describe("Registering proposals", () => {
    beforeEach(async () => {
      await voting.addVoter(addr1.address);
      await voting.startProposalRegistration();
    });

    it("Admin should start proposal registration", async () => {
      expect(await voting.processStatus()).to.equal(
        processStatus.ProposalRegistrationStarted
      );
    });

    it("Participant should register proposal", async () => {
      const proposalName = "Change app frontend";
      await voting.connect(addr1).addProposal(proposalName);
      const proposal = await voting.proposals(0);
      expect(proposal[0]).to.equal(proposalName);
    });

    it("Admin should end proposal registration", async () => {
      await voting.endProposalRegistration();
      expect(await voting.processStatus()).to.equal(
        processStatus.ProposalRegistrationEnded
      );
    });
  });

  describe("Registering votes", () => {
    beforeEach(async () => {
      await voting.addVoter(addr1.address);
      await voting.addVoter(addr2.address);
      await voting.addVoter(addr3.address);
      await voting.startProposalRegistration();
      await voting.connect(addr2).addProposal("Not so appealing proposal");
      await voting.connect(addr3).addProposal("Change app frontend");
      await voting.endProposalRegistration();
      await voting.startVotesRegistration();
    });

    it("Admin should start votes registration", async () => {
      expect(await voting.processStatus()).to.equal(
        processStatus.VotingStarted
      );
    });

    it("Participant should register vote", async () => {
      const proposalId = 1;
      await voting.connect(addr1).addVote(proposalId);
      await voting.connect(addr2).addVote(proposalId);
      await voting.connect(addr3).addVote(proposalId);
      const proposalVoteCount = await voting.proposals(proposalId);
      expect(proposalVoteCount.voteCount).to.equal(3);
    });

    it("Participant should not register more than one vote", async () => {
      const proposalId = 1;
      await voting.connect(addr1).addVote(proposalId);
      await expect(
        voting.connect(addr1).addVote(proposalId)
      ).to.be.revertedWith("Participants can vote just one time!!");
      const proposalVoteCount = await voting.proposals(proposalId);
      expect(proposalVoteCount.voteCount).to.equal(1);
    });

    it("Admin should end proposal registration", async () => {
      await voting.endVotesRegistration();
      expect(await voting.processStatus()).to.equal(
        processStatus.VotingEnded
      );
    });
  });
});
