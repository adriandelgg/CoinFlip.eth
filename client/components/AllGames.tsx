import { useContext, useEffect, useState } from 'react';
import { Web3Context } from './Web3Context';
const account0 = '0x0000000000000000000000000000000000000000';

const AllGames = () => {
	const { contract, ethers } = useContext(Web3Context);
	const [games, setGames] = useState<any[]>([]);

	useEffect(() => {
		getGames();
	}, []);

	async function getGames() {
		const gameID = +(await contract.getGameID()) - 1;
		if (gameID === -1) return;
		const totalGames = [];

		for (let i = gameID; i < gameID + 10; i++) {
			const gameStruct = await contract.getGamesReady(i);

			if (gameStruct[0] !== account0) {
				totalGames.push(gameStruct);
				setGames(totalGames);
			}
		}
	}

	return (
		<section>
			{games.map(game => {
				const [player1, player2, coinFlipper, betAmount, gameID] = game;
				return (
					<div className="action-card" key={+gameID}>
						<h3>Game {String(+gameID)}</h3>
						<h4>Amount Bet:</h4>
						<p>{String(+betAmount)} FLIP</p>
						<button
							className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-4 rounded"
							onClick={async () =>
								await contract.betTokens(
									betAmount.add(ethers.utils.parseUnits('2', 12)),
									gameID,
									Math.floor(Math.random() * 2) + 1
								)
							}
						>
							Challenge
						</button>
					</div>
				);
			})}
		</section>
	);
};

export default AllGames;
