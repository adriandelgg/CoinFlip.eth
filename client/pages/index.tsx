import { useContext } from 'react';
import { Web3Context } from '../components/Web3Context';
import Image from 'next/image';

import NavBar from '../components/navbar/NavBar';
import NewGame from '../components/NewGame';
import AllGames from '../components/AllGames';

export default function Home() {
	const { contract } = useContext(Web3Context);
	return (
		<>
			<NavBar />
			<div className="text-center mb-5">
				<h1 className="text-2xl">CoinFlip ETH Game</h1>
				<h2 className="text-xl mb-4">by Adrian Delgado</h2>
				{!contract && (
					<div className="p-clamp mx-auto">
						<Image src="/metamask.svg" width={200} height={200} />
						<p className="mt-6">
							To use this dApp, switch your network to Rinkeby, or go to{' '}
							<a
								className="text-blue-400 underline"
								href="https://github.com/adriandelgg/CoinFlip.eth"
								target="_blank"
							>
								Github Source Code
							</a>{' '}
							and see the instructions on how to run on the Hardhat local
							network.
						</p>
						<br />
						<p>
							If you're using Rinkeby, you will need some test Ether which you
							can get at a faucet.
							<br />
							<a
								className="text-blue-400 underline"
								href="https://faucet.rinkeby.io/"
								target="_blank"
							>
								https://faucet.rinkeby.io/
							</a>
						</p>
					</div>
				)}
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
