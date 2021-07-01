import { useContext, useEffect, useState } from 'react';
import { Web3Context } from '../Web3Context';

const TotalEarnings = () => {
	const { contract, ethers } = useContext(Web3Context);
	const [earnings, setEarnings] = useState('0');

	useEffect(() => {
		getEarnings();
	}, []);

	useEffect(() => {
		contract.on('Transfer', getEarnings);
		return () => {
			contract.removeListener('Transfer', getEarnings);
		};
	}, []);

	useEffect(() => {
		contract.on('Approval', getEarnings);
		return () => {
			contract.removeListener('Approval', getEarnings);
		};
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
		if (earnings !== '0.0') {
			await contract.transferFrom(
				contract.address,
				contract.signer._address,
				ethers.utils.parseUnits(earnings)
			);
		}
	}

	return (
		<div>
			<h2 className="pt-1">Total Earnings</h2>
			<p className="pb-1">{earnings} FLIP</p>
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
