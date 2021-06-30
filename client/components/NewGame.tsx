import { useContext, useState } from 'react';
import { Web3Context } from './Web3Context';

const NewGame = () => {
	const { contract, ethers } = useContext(Web3Context);

	const [amount, setAmount] = useState('');

	async function createNewGame(e: React.MouseEvent<HTMLButtonElement>) {
		e.preventDefault();
		console.log(contract);
		const result = await contract.balanceOf(
			'0x5FbDB2315678afecb367f032d93F642f64180aa3'
		);
		console.log(result);

		if (amount) {
			const betAmount = ethers.BigNumber.from(amount);
			console.log(betAmount);
			const result = await contract.createGame(amount);
			console.log(result);
			setAmount('');
		}
	}

	return (
		<form className="action-card mx-auto">
			<h3 className="text-center text-lg mb-3">Create New Game</h3>
			<label className="p-1" htmlFor="bet-amount">
				Bet Amount:
			</label>
			<input
				className="input-field"
				id="bet-amount"
				type="number"
				name="amount"
				placeholder="Amount to bet..."
				required={true}
				min={0}
				onChange={e => setAmount(e.target.value)}
			/>
			<button
				className="py-1 px-4 mx-auto mt-4 bg-green-400
        text-white font-bold w-max rounded"
				type="submit"
				onClick={createNewGame}
			>
				Create Game
			</button>
		</form>
	);
};

export default NewGame;