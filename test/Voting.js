const { expect } = require("chai");
const { ethers } = require("hardhat");

var toType = function(obj) {
  return ({}).toString.call(obj).match(/\s([a-zA-Z]+)/)[1].toLowerCase()
}

describe("Voting contract", () => {
  let Voting, voting, admin, addr1, addr2;
  const processStatus = {
    RegisteringVoters: 0,
    ProposalRegistrationStarted: 1,
    ProposalRegistrationStartedEnded: 2,
    VotingStarted: 3,
    VotingEnded: 4,
  };

  beforeEach(async () => {
    Voting = await ethers.getContractFactory("Voting");
    voting = await Voting.deploy();
    [admin, addr1, addr2, _] = await ethers.getSigners();
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
    it("Should remove voter", async () => {
      await voting.removeVoter(addr1.address);
      const voter = await voting.voters(addr1.address);
      expect(voter.isRegistered).to.be.false;
      expect(voter.hasVoted).to.be.false;
      expect(voter.votedProposalId).to.equal(0);
    });
  });
  
  describe("Registering proposals", ( ) => {

    beforeEach(async () => {
      await voting.addVoter(addr1.address);
      await voting.startProposalRegistration();
    });

    it("Proposal registration should be started", async () => {
      expect(await voting.processStatus()).to.equal(
        processStatus.ProposalRegistrationStarted
      );
    });

    it("Participant should register proposal", async () => {
      const proposalName = "Change app frontend"
      await voting.connect(addr1).addProposal(proposalName);
      await expect(voting.proposals(0)).not.to.be.reverted;
      const proposal = await voting.proposals(0);
      expect(proposal[0]).to.equal(proposalName);
    });
  });
});
