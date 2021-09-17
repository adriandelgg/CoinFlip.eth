# CoinFlip ETH Game by Adrian Delgado 👨‍💻

🎮 Demo App: <https://coinflip-eth.vercel.app/>

🎨 Tools Used: Solidity, Hardhat, Ethers.js, TypeScript, React, Waffle, ERC20, Tailwind CSS, Next.js, Chai.

## Instructions

### Rinkeby

Using the Rinkeby test network will be the easiest way to use this app.

If using the app on the Rinkeby test network, you must get some test Ether from a [faucet](https://faucet.rinkeby.io/).

### Hardhat Network

You can also easily test out the app using a local blockchain by running a Hardhat node.

1. Clone this repository.
2. `$ npm install` in the root directory of the project to download it's dependencies.
3. `$ npx hardhat node` in the root directory to start up the local blockchain. **NOTE: This terminal MUST be kept open!**
4. `$ npx hardhat run scripts/deploy.js` to deploy the smart contract to the local blockchain network.
5. `$ cd client && npm install` to enter the React app & install it's dependencies.
6. `$ npm run dev` from the `client` directory, then on your browser go to `http://localhost:3000`.

#### **Enjoy the game!** 😊
