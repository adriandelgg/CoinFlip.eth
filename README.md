🪙 CoinFlip ETH Game by Adrian Delgado 👨‍💻

🎮 Demo App: https://coinflip-eth.vercel.app/

🎨 Tools Used: Solidity, Hardhat, Ethers.js, TypeScript, React, Waffle, ERC20, Tailwind CSS, Next.js, Chai.

### Rinkeby

Using the Rinkeby test network will be the easiest way to use this app.

If using the app on the Rinkeby test network, you must get some test Ether from a [https://faucet.rinkeby.io/](faucet).

### Hardhat Network

You can also easily test out the app using a local blockchain by running a Hardhat node.

To do this:

1. Clone this repository.
2. `$ npm install` in the root directory of the project to download it's dependencies.
3. `$ npx hardhat node` in the root directory to start up the local blockchain. NOTE: Keep this terminal open!
4. `$ npx hardhat run scripts/deploy.js` to deploy the smart contract to the local blockchain network.
5. Copy & paste the outputted contract address on the terminal which we'll be using in step 7.
6. `$ cd client && npm install` to enter the React app & install it's dependencies.
7. Go to the following folders/files:
   1. components
   2. navbar
   3. MetaMask.js
   4. Paste the contract address you copied in step 5 and replace the string that holds the other address:

    ```javascript
    // Hardhat Local
    else if (chainId === '0x7a69') {
      contractAddress = 'REPLACE_ME_WITH_CONTRACT_ADDRESS_FROM_TERMINAL';
    }
    ```

8. `$ npm run dev` from the `client` directory, then on your browser go to `localhost:3000`.

Enjoy the game! 😊
