const { expect } = require("chai");
const { ethers } = require("hardhat");

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

  // describe("Registering proposals", ( ) => {
  //   it("Should set ")
  // });

  //   describe("Deposit", () => {
  //     it("Should receive ether", async () => {
  //       const initialAccountBalance = await ethers.provider.getBalance(
  //         addr1.address
  //       );
  //       const tx = await voting
  //         .connect(addr1)
  //         .deposit({ value: ethers.utils.parseEther("1") });
  //       const receipt = await tx.wait();
  //       const gasFee = receipt.cumulativeGasUsed.mul(receipt.effectiveGasPrice);
  //       console.log(
  //         "total ether spent on gas for transaction: \t",
  //         ethers.utils.formatEther(gasFee)
  //       );
  //       const contractBalance = await voting.getBalance();
  //       expect(contractBalance).to.equal(ethers.utils.parseEther("1"));
  //       const accountBalance = await ethers.provider.getBalance(addr1.address);
  //       expect(accountBalance).to.equal(
  //         initialAccountBalance.sub(ethers.utils.parseEther("1")).sub(gasFee)
  //       );
  //     });
  //   });
  //   describe("Send", () => {
  //     it("Should send ether", async () => {
  //       const initialContractBalance = await voting.getBalance();
  //       await voting.send(addr1.address, { value: ethers.utils.parseEther("1") });
  //       const contractBalance = await voting.getBalance();
  //       expect(contractBalance).to.equal(initialContractBalance);
  //     });

  // it('Should update receiver balance', async () => {
  //     const initialBalance = await addr1.balance;
  //     await token.send(addr1.address, 50);
  //     const balance = await contract.provider.getBalance(contract.address);;
  //     expect(addr1.balance).to.equal(initialBalance - 50);

  // });

  // it('Should fail if sender doesnt have enough tokens', async () => {
  //     const initialOwnerBalance = await token.balanceOf(owner.address);

  //     await expect(
  //         token
  //             .connect(addr1)
  //             .transfer(owner.address, 1)
  //     )
  //     .to
  //     .be
  //     .revertedWith('Not enough tokens');

  //     expect(
  //         await token.balanceOf(owner.address)
  //     )
  //     .to
  //     .equal(initialOwnerBalance);
  // });

  // it('Should update balances after transfers', async () => {
  //     const initialOwnerBalance = await token.balanceOf(owner.address);

  //     await token.transfer(addr1.address, 100);

  //     const finalOwnerBalance = await token.balanceOf(owner.address);
  //     expect(initialOwnerBalance - 150).to.equal(finalOwnerBalance);

  //     const addr1Balance = await token.balanceOf(addr1.address);
  //     expect(addr1Balance).to.equal(100);

  // });
  // });
});
