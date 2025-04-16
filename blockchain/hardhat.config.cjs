// hardhat.config.cjs

const { config: dotenvConfig } = require('dotenv');
dotenvConfig();

require('@nomicfoundation/hardhat-toolbox');

/** @type import('hardhat/config').HardhatUserConfig */
const config = {
  solidity: '0.8.20',
  networks: {
    aloy: {
      url: process.env.ALOY_RPC_URL,
      accounts: [process.env.PRIVATE_KEY]
    }
  }
};

module.exports = config;