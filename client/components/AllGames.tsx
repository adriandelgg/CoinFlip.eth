import { useContext, useState } from 'react';
import { Web3Context } from './Web3Context';

const AllGames = () => {
	const { contract, ethers } = useContext(Web3Context);

	async function getGameIDs() {
		const gameID = (await contract.getGameID()) - 1;
		if (gameID) {
			for (let i = gameID; i > 0; i--) {
				await contract.getAmountBet(i);
			}
		}
	}

	return (
		<section>
			<div>
				<h3>Game {id}</h3>
				<h4>Amount Bet:</h4>
				<p></p>
				<button>Bet In</button>
			</div>
		</section>
	);
};

export default AllGames;
