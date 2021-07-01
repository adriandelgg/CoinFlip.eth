import { useContext, useState } from 'react';
import { Web3Context } from './Web3Context';

const NewGame = () => {
	const { contract, ethers } = useContext(Web3Context);

	const [amount, setAmount] = useState('');

	async function createNewGame(e: React.MouseEvent<HTMLButtonElement>) {
		e.preventDefault();

		if (amount) {
			const betAmount = ethers.utils.parseEther(amount);
			await contract.createGame(betAmount);
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
				value={amount || ''}
				placeholder="Amount to bet..."
				required={true}
				min={0}
				onChange={e => setAmount(e.target.value)}
			/>
			<p className="text-xs pt-2">
				*Bet amount must be more than 2 szabo (2e12).
			</p>
			<p className="text-center">{amount || 0} FLIP</p>
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
