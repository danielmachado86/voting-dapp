const { ethers } = require("hardhat");

async function main() {
    // We get the contract to deploy
    const Voting = await ethers.getContractFactory("Voting");
    const voting = await Voting.deploy();
  
    console.log("Greeter deployed to:", voting.address);
  }
  
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });