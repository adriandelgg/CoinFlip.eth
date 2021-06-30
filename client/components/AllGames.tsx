import { useContext, useState } from 'react';
import { Web3Context } from './Web3Context';

const AllGames = () => {
	const { contract, ethers } = useContext(Web3Context);

	return (
		<section>
			<div></div>
		</section>
	);
};

export default AllGames;
