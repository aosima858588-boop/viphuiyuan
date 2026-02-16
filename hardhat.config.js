require("@nomiclabs/hardhat-ethers");
require("@nomiclabs/hardhat-etherscan");
require("@openzeppelin/hardhat-upgrades");

// Load environment variables
const DEPLOYER_PRIVATE_KEY = process.env.DEPLOYER_PRIVATE_KEY || "0x0000000000000000000000000000000000000000000000000000000000000000";
const OKX_RPC_URL = process.env.OKX_RPC_URL || "https://exchainrpc.okex.org";
const OKX_TESTNET_RPC_URL = process.env.OKX_TESTNET_RPC_URL || "https://exchaintestrpc.okex.org";
const OKX_EXPLORER_API_KEY = process.env.OKX_EXPLORER_API_KEY || "";

module.exports = {
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    okx: {
      url: OKX_RPC_URL,
      chainId: 66,
      accounts: [DEPLOYER_PRIVATE_KEY],
    },
    okx_testnet: {
      url: OKX_TESTNET_RPC_URL,
      chainId: 65,
      accounts: [DEPLOYER_PRIVATE_KEY],
    },
  },
  etherscan: {
    apiKey: {
      okx: OKX_EXPLORER_API_KEY,
      okx_testnet: OKX_EXPLORER_API_KEY,
    },
    customChains: [
      {
        network: "okx",
        chainId: 66,
        urls: {
          apiURL: "https://www.oklink.com/api/explorer/v1/contract/verify/async/api",
          browserURL: "https://www.oklink.com/okc"
        }
      },
      {
        network: "okx_testnet",
        chainId: 65,
        urls: {
          apiURL: "https://www.oklink.com/api/explorer/v1/contract/verify/async/api",
          browserURL: "https://www.oklink.com/okc-test"
        }
      }
    ]
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts"
  }
};
