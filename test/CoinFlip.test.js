const { expect } = require('chai');

describe('CoinFlip', function () {
	let CoinFlip, owner, alice, bob, contract, token1, token2;

	beforeEach(async function () {
		CoinFlip = await ethers.getContractFactory('CoinFlip');
		[owner, alice, bob] = await ethers.getSigners();
		contract = await CoinFlip.deploy();
		contract2 = contract.connect(alice);
	});

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

	it('should revert if player is not 0 or 1', async () => {
		await expect(contract.selectPlayer(7)).to.be.reverted;
		await expect(contract.selectPlayer(2)).to.be.revertedWith(
			'Number must be 0 or 1'
		);
		await expect(contract.selectPlayer(0)).to.not.be.reverted;
		await expect(contract.selectPlayer(1)).to.not.be.reverted;
	});

	it('should create a new game & set values properly to mappings', async () => {
		await expect(contract.createGame(1e12)).to.be.reverted;
		const contractAmountBefore = +(await contract.balanceOf(contract.address));

		const oneEther = ethers.BigNumber.from('1000000000000000000');
		console.log(oneEther);
		await contract.getTokens(oneEther);
		expect(await contract.balanceOf(owner.address)).to.equal(oneEther);
		// await contract.createGame(3e12);
		// const contractAmountAfter = +(await contract.balanceOf(contract.address));
	});
});
