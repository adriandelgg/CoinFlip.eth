const { expect } = require('chai');

describe('Greeter', function () {
	let Minter, owner, alice, bob, contract, token1, token2;

	beforeEach(async function () {
		Minter = await ethers.getContractFactory('Minter');
		[owner, alice, bob] = await ethers.getSigners();
		contract = await Minter.deploy();
		contract2 = contract.connect(alice);
	});

	describe('', () => {
		it('should ', async () => {});
	});
});
