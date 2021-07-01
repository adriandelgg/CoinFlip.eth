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
		const totalGames: any[] = [];

		for (let i = gameID; i > gameID - 10; i--) {
			if (i == -1) break;
			const gameStruct = await contract.getGamesReady(i);

			if (gameStruct[0] !== account0 && !games.includes(gameStruct)) {
				totalGames.push(gameStruct);
			}
		}

		if (totalGames.length > 0) {
			setGames(prev => [...prev, ...totalGames]);
		}
	}

	return (
		<section className="flex flex-wrap">
			{games.map(game => {
				const [player1, player2, coinFlipper, betAmount, gameID] = game;

				return (
					<div className="action-card text-center m-1" key={gameID}>
						<h3>Game {String(+gameID)}</h3>
						<h4>Amount Bet:</h4>
						<p>{String(+ethers.utils.formatUnits(betAmount, 'ether'))} FLIP</p>
						{coinFlipper === account0 ? (
							contract.signer._address !== player1 ? (
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
							) : (
								<button className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-1 px-4 rounded">
									Waiting Challenger
								</button>
							)
						) : contract.signer._address === coinFlipper ? (
							<button
								className="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-4 rounded"
								onClick={async () =>
									await contract.startGame(
										gameID,
										Math.floor(Math.random() * 2) + 1
									)
								}
							>
								Start Game
							</button>
						) : (
							<button className="bg-gray-500 text-white font-bold py-1 px-4 rounded">
								Players Set
							</button>
						)}
					</div>
				);
			})}
		</section>
	);
};

export default AllGames;
