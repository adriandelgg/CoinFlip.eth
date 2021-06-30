import { useContext, useEffect, useState } from 'react';
import { Web3Context } from './Web3Context';

const AllGames = () => {
	const { contract, ethers } = useContext(Web3Context);
	const [games, setGames] = useState<any[]>([]);

	useEffect(() => {
		getGames();
	}, []);

	// async function getGameIDs() {
	// 	const gameID = await contract.getGameID();
	// 	if (gameID) {
	// 		const totalGames = [];
	// 		for (let i = gameID; i >= 0; i--) {
	// 			const gameStruct = await contract.getGamesReady(i);

	// 			console.log(gameStruct);
	// 			if (+gameStruct.betAmount) {
	// 				totalGames.push(gameStruct);
	// 			}
	// 		}
	// 	}
	// }

	async function getGames() {
		const gameID = +(await contract.getGameID()) - 1;
		if (gameID === -1) return;
		const totalGames = [];

		for (let i = gameID; i < gameID + 10; i++) {
			const gameStruct = await contract.getGamesReady(i);
			console.log(gameStruct);
			totalGames.push(gameStruct);
			setGames(totalGames);
		}
	}

	// games.map(game => {
	// 	const []
	// })

	return (
		<section>
			<div>
				{/* <h3>Game {id}</h3> */}
				<h4>Amount Bet:</h4>
				<p></p>
				<button>Bet In</button>
			</div>
		</section>
	);
};

export default AllGames;
