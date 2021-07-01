/**
 * To deploy via Infura you'll need a wallet provider (like @truffle/hdwallet-provider)
 * to sign your transactions before they're sent to a remote public node. Infura accounts
 * are available for free at: infura.io/register.
 *
 * You'll also need a mnemonic - the twelve word phrase the wallet uses to generate
 * public/private key pairs. If you're publishing your code to GitHub make sure you load this
 * phrase from a file you've .gitignored so it doesn't accidentally become public.
 *
 */

// const HDWalletProvider = require('@truffle/hdwallet-provider');
// const infuraKey = "fj4jll3k.....";
//
// const fs = require('fs');
// const mnemonic = fs.readFileSync(".secret").toString().trim();

module.exports = {
	networks: {
		development: {
			host: '127.0.0.1',
			port: 7545,
			network_id: '*' // Match any network id
		}
		// rinkeby: {
		// 	provider: function() {
		// 		return new HDWalletProvider(, "https://rinkeby.infura.io/v3/35903f94ae1640f39995a7e845c396c8");
		// 	},
		// 	network_id: 4
		// }
	},
	compilers: {
		solc: {
			version: '0.8.5',
			optimizer: {
				enabled: true,
				runs: 200
			}
		}
	}
};
