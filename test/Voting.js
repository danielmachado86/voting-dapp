const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Voting contract", () => {
  let Voting, voting, owner, addr1;

  beforeEach(async () => {
    Voting = await ethers.getContractFactory("Voting");
    voting = await Voting.deploy();
    [owner, addr1, _] = await ethers.getSigners();
  });

  describe("Deployment", () => {

    it("Should set the voting app admin", async () => {
      expect(await voting.owner()).to.equal(owner.address);
    });
  });

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
