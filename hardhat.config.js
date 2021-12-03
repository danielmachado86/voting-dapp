/**
 * @type import('hardhat/config').HardhatUserConfig
 */

require("@nomiclabs/hardhat-waffle");

task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});
 
module.exports = {
  solidity: "0.8.9",
  paths: {
    artifacts: "./src/artifacts"
  },
  networks: {
    localhost: {
      chainId: 31337
    },
  }
};
