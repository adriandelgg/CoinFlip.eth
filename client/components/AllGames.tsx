import { useContext, useEffect, useState } from 'react';
import { Web3Context } from './Web3Context';
const account0 = '0x0000000000000000000000000000000000000000';

const AllGames = () => {
	const { contract, ethers } = useContext(Web3Context);
	const [games, setGames] = useState<any[]>([]);

	useEffect(() => {
		getGames();
	}, []);

	useEffect(() => {
		contract.on('Transfer', () => {
			getGames();
		});
	});

	useEffect(() => {
		contract.on('Approval', () => {
			getGames();
		});
	});

	async function getGames() {
		const gameID = +(await contract.getGameID()) - 1;
		if (gameID === -1) return;
		const totalGames: any[] = [];

		for (let i = gameID; i > gameID - 10; i--) {
			if (i == -1) break;
			const gameStruct = await contract.getGames(i);

			if (gameStruct[0] !== account0 && !games.includes(gameStruct)) {
				totalGames.push(gameStruct);
			}
		}

		if (totalGames.length > 0) {
			setGames(totalGames);
		}
	}

	return (
		<section className="flex flex-wrap justify-center mt-4">
			{games.map(game => {
				const [player1, player2, coinFlipper, betAmount, gameID] = game;

				return (
					<div className="game-card text-center m-3" key={gameID}>
						<h3 className="text-lg underline">Game {String(+gameID)}</h3>
						<h4>Amount Bet:</h4>
						<p className="mb-2">
							{String(+ethers.utils.formatUnits(betAmount, 'ether'))} FLIP
						</p>
						{coinFlipper === account0 ? (
							contract.signer._address !== player1 && player2 === account0 ? (
								<button
									className="bg-red-500 hover:bg-red-700 btn"
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
								<button className="bg-gray-500 btn cursor-default">
									Waiting Challenger
								</button>
							)
						) : contract.signer._address === coinFlipper ? (
							<button
								className="bg-green-500 hover:bg-green-700 btn"
								onClick={async () => {
									const random = Math.floor(Math.random() * 2) + 1;
									await contract.startGame(gameID, random);
									random == 1
										? console.log(player1 + ' won!')
										: console.log(player2 + ' won!');
								}}
							>
								Start Game
							</button>
						) : (
							<button className="bg-gray-500 btn cursor-default">
								Waiting for Flipper to Start
							</button>
						)}
					</div>
				);
			})}
		</section>
	);
};

export default AllGames;
