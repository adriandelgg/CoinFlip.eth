import NavBar from '../components/navbar/NavBar';
import NewGame from '../components/NewGame';

export default function Home() {
	return (
		<>
			<NavBar />
			<div className="text-center">
				<h1>CoinFlip ETH Game</h1>
				<h2>by Adrian Delgado</h2>
			</div>
			<NewGame />
		</>
	);
}
