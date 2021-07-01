import { useContext } from 'react';
import { Web3Context } from '../components/Web3Context';

import NavBar from '../components/navbar/NavBar';
import NewGame from '../components/NewGame';
import AllGames from '../components/AllGames';

export default function Home() {
	const { contract, provider } = useContext(Web3Context);
	return (
		<>
			<NavBar />
			<div className="text-center mb-6">
				<h1 className="text-2xl">CoinFlip ETH Game</h1>
				<h2 className="text-xl">by Adrian Delgado</h2>
			</div>
			{contract && (
				<main>
					<NewGame />
					<AllGames />
				</main>
			)}
		</>
	);
}
