require("@nomicfoundation/hardhat-toolbox");
require("@nomiclabs/hardhat-etherscan")
require("hardhat-deploy")
require("dotenv").config()

/** @type import('hardhat/config').HardhatUserConfig */
// use nemonics for accounts --> 

const PRIVATEKEY = process.env.PRIVATEKEY;
const GOERLI_RPC_URL = process.env.GOERLI_RPC_URL;
const ETHERSCAN_API = process.env.ETHERSCAN_API;
//const MNEMONIC = process.env.MNEMONIC;
const ADDRESS = process.env.ADDRESS;

module.exports = {

  defaultNetwork: "hardhat",
  networks: {
    goerli: {
      // this can also be done with the alchemy link with api and with the mnemoic for accounts
      url: "https://eth-goerli.g.alchemy.com/v2/_ARqf35oxzZ7iUkNAXTYnacKbgvFrwvp", // goeli rpc
      accounts: [PRIVATEKEY],
      saveDevelopments: true,
      chainId: 5,
    },
    hardhat: {
      chainId: 31337,
    },
    localhost: {
      chainId: 31337,
    }
  },
  etherscan: {
    apiKey: {
      goerli: ETHERSCAN_API,
    }
  },
  namedAccounts: {
    deployer: {
      default: 0,
    },
    player: {
      default: 1,
    },
  },
  address: {
    rozzo: ADDRESS,
  },
  solidity: "0.8.17",
};
