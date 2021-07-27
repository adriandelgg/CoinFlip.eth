import { useContext, useEffect, useState } from 'react';
import { Web3Context } from '../Web3Context';

const GetTokens = () => {
	const { contract, oneEther, ethers } = useContext(Web3Context);
	const [balance, setBalance] = useState('0');

	useEffect(() => {
		getBalance();
	}, []);

	useEffect(() => {
		contract.on('Transfer', getBalance);
		return () => contract.removeListener('Transfer', getBalance);
	}, []);

	async function getBalance() {
		const result = String(await contract.balanceOf(contract.signer._address));
		setBalance(ethers.utils.formatEther(result));
	}

	return (
		<div>
			<h3 className="pt-1">Current Balance:</h3>
			<p>{balance} FLIP</p>
			<button
				className="btn bg-green-500 hover:bg-green-600"
				onClick={async () => await contract.getTokens(oneEther.mul('10'))}
			>
				Free Tokens
			</button>
		</div>
	);
};

export default GetTokens;
