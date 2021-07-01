require('@nomiclabs/hardhat-waffle');
require('dotenv').config();
require('@nomiclabs/hardhat-solhint');
// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task('accounts', 'Prints the list of accounts', async () => {
	const accounts = await ethers.getSigners();

	for (const account of accounts) {
		console.log(account.address);
	}
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
	defaultNetwork: 'localhost',
	networks: {
		rinkeby: {
			url: process.env.INFURA_RINKEBY_KEY,
			accounts: [process.env.PRIVATE_KEY_17]
		},
		kovan: {
			url: process.env.INFURA_KOVAN_KEY,
			accounts: [process.env.PRIVATE_KEY_17]
		},
		ropsten: {
			url: process.env.INFURA_ROPSTEN_KEY,
			accounts: [process.env.PRIVATE_KEY_17]
		}
	},
	solidity: {
		version: '0.8.5',
		settings: {
			optimizer: {
				enabled: true,
				runs: 200
			}
		}
	}
};
