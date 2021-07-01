import { useContext, useEffect, useState } from 'react';
import { Web3Context } from '../Web3Context';

const TotalEarnings = () => {
	const { contract, ethers } = useContext(Web3Context);
	const [earnings, setEarnings] = useState('0');

	useEffect(() => {
		getEarnings();
	}, []);

	async function getEarnings() {
		const earningsInEther = String(
			ethers.utils.formatEther(
				await contract.allowance(contract.address, contract.signer._address)
			)
		);
		setEarnings(earningsInEther);
	}

	async function withdrawEarnings() {
		await contract.transferFrom(
			contract.address,
			contract.signer._address,
			ethers.utils.parseUnits(earnings)
		);
	}

	return (
		<div className="text-center">
			<h2>Total Earnings</h2>
			<p>{earnings} FLIP</p>
			<button
				className="btn bg-yellow-500 hover:bg-yellow-600"
				onClick={withdrawEarnings}
			>
				Withdraw
			</button>
		</div>
	);
};

export default TotalEarnings;
