const { expect } = require('chai');

describe('CoinFlip', function () {
	let CoinFlip, owner, alice, contract, contract2;
	const oneEther = ethers.BigNumber.from('1000000000000000000');

	beforeEach(async function () {
		CoinFlip = await ethers.getContractFactory('CoinFlip');
		[owner, alice] = await ethers.getSigners();
		contract = await CoinFlip.deploy();
		contract2 = contract.connect(alice);
	});

	describe('Checking ERC20 Tokens', async function () {
		it('should store tokens to contract on deployment', async () => {
			// Checks that contract has tokens stored when deployed
			const result = await contract.balanceOf(contract.address);
			const resultInWei = ethers.utils.formatEther(result);
			expect(+resultInWei).to.equal(1e7);

			// Makes sure deployer doesn't have any tokens
			const ownerBalance = (await contract.balanceOf(owner.address)).toNumber();
			expect(ownerBalance).to.equal(0);
		});

		it('should let you get ERC20 tokens', async () => {
			const contractAmountBefore = +(await contract.balanceOf(contract.address));
			await contract.getTokens(1e12);
			const ownerBalance = +(await contract.balanceOf(owner.address));
			const contractAmountAfter = +(await contract.balanceOf(contract.address));

			expect(ownerBalance).to.equal(1e12);
			expect(contractAmountBefore).to.be.greaterThan(contractAmountAfter);
		});

		it('should fail if you get more tokens than are available', async () => {
			await expect(
				contract.getTokens(ethers.BigNumber.from('1000000000000000000000000000'))
			).to.be.reverted;
		});
	});

	describe('Setting up Player 1 & Game', async function () {
		it('should revert if player is not 1 or 2', async () => {
			await expect(contract.getPlayerAddress(7, 0)).to.be.reverted;
			await expect(contract.getPlayerAddress(3, 0)).to.be.revertedWith(
				'Number must be 1 or 2'
			);
		});

		it("should return correct player's address", async () => {
			await contract.getTokens(oneEther);
			await contract.createGame(3e12);
			expect(await contract.getPlayerAddress(1, 0)).to.equal(owner.address);

			const address = ethers.utils.hexStripZeros(
				await contract.getPlayerAddress(2, 0)
			);
			expect(address).to.equal('0x');
		});

		it('should create a new game & set values properly to mappings', async () => {
			// Checks that tokens were transferred to caller
			await contract.getTokens(oneEther);
			await expect(contract.createGame(1e12)).to.be.reverted;

			expect(await contract.balanceOf(owner.address)).to.equal(oneEther);

			// Checks that contract received collateral
			const contractAmountBefore = await contract.balanceOf(contract.address);
			await contract.createGame(3e12);
			const contractAmountAfter = await contract.balanceOf(contract.address);

			expect(contractAmountBefore.lt(contractAmountAfter)).to.be.true;

			const player1 = await contract.getPlayerAddress(1, 0);
			expect(player1).to.equal(owner.address);
		});
	});

	describe('Setting up Player 2', () => {
		beforeEach(async function () {
			await contract.getTokens(oneEther);
			await contract2.getTokens(oneEther);
			await contract.createGame(3e12);
			randomNum = Math.floor(Math.random() * 2) + 1;
		});

		it('should pass all betTokens() requires', async () => {
			await expect(contract2.betTokens(4e12, 0, randomNum)).to.be.revertedWith(
				'Amount not equal to bet amount'
			);
			await contract2.betTokens(3e12, 0, randomNum);
			await expect(contract2.betTokens(3e12, 0, randomNum)).to.be.revertedWith(
				'2nd player already exists'
			);
			await expect(
				contract2.betTokens(oneEther, 0, randomNum)
			).to.be.revertedWith('Amount not equal to bet amount');
			await expect(contract2.betTokens(1, 0, randomNum)).to.be.revertedWith(
				'Amount not equal to bet amount'
			);
		});

		it('should allow 2nd player to bet in', async () => {
			const contractAmountBefore = await contract2.balanceOf(contract2.address);
			await contract2.betTokens(3e12, 0, randomNum);
			const contractAmountAfter = await contract2.balanceOf(contract2.address);

			expect(contractAmountBefore.lt(contractAmountAfter)).to.be.true;

			const player2 = await contract2.getPlayerAddress(2, 0);
			expect(player2).to.equal(alice.address);
		});
	});

	describe('Playing a Game', async function () {
		beforeEach(async function () {
			await contract.getTokens(oneEther);
			await contract2.getTokens(oneEther);
			await contract.createGame(3e12);
			randomNum = Math.floor(Math.random() * 2) + 1;
		});

		it('should have coinflipper win', async () => {
			await contract2.betTokens(3e12, 0, 1);

			await expect(contract2.startGame(0, 2)).to.be.revertedWith(
				"You're not the coin flipper"
			);
			await contract.startGame(0, 1);

			expect(await contract.allowance(contract.address, owner.address)).to.equal(
				4e12
			);
		});

		it('should have non-coinflipper win', async () => {
			await contract2.betTokens(3e12, 0, 1);
			await contract.startGame(0, 2);

			expect(await contract.allowance(contract.address, alice.address)).to.equal(
				4e12
			);
		});

		it('should have non-coinflipper player 1 win', async () => {
			await contract2.createGame(3e12);
			await contract.betTokens(3e12, 1, 2);
			await contract.startGame(1, 2);

			expect(await contract.allowance(contract.address, alice.address)).to.equal(
				4e12
			);
		});

		it('should withdraw earnings', async () => {
			await contract2.betTokens(3e12, 0, 1);
			await contract.startGame(0, 2);

			expect(await contract.allowance(contract.address, alice.address)).to.equal(
				4e12
			);

			await expect(() =>
				contract2.transferFrom(contract2.address, alice.address, 3e4)
			).to.changeTokenBalance(contract2, alice, 3e4);
		});
	});

	describe('Gas Checkers', () => {
		beforeEach(async function () {
			await contract.getTokens(oneEther);
			await contract2.getTokens(oneEther);
		});

		it('should check for gas in createGame()', async () => {
			const result = await contract.estimateGas.createGame(3e12);
			await contract.createGame(3e12);
		});

		it('should check gas for betTokens()', async () => {
			await contract.createGame(3e12);
			const result = await contract2.estimateGas.betTokens(3e12, 0, 1);
		});

		it('should check getPlayerAddress() gas', async () => {
			await contract.createGame(3e12);
			const result = await contract.estimateGas.getPlayerAddress(2, 0);
			console.log(result.toString());
		});

		it('should check createGame() refactored', async () => {
			const result = await contract.estimateGas.createGame(3e12);
			console.log(result.toString());
		});

		it('should check betTokens() refactored', async () => {
			await contract.createGame(3e12);
			const result = await contract2.estimateGas.betTokens(3e12, 0, 1);
			console.log(result.toString());
		});

		it('should check startGame()', async () => {
			await contract.createGame(3e12);
			await contract2.betTokens(3e12, 0, 1);
			const result = await contract.estimateGas.startGame(0, 1);
			console.log(result.toString());
		});

		it('should check uint vs uint8', async () => {
			await contract.createGame(3e12);
			const gas = await contract.estimateGas.getPlayerAddress(1, 0);
			console.log(gas.toString());
		});
	});
});
