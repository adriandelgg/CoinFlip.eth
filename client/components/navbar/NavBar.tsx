import { useContext } from 'react';
import { Web3Context } from '../Web3Context';
import MetaMask from './MetaMask';
import Image from 'next/image';
import GetTokens from './GetTokens';

const NavBar: React.FC = () => {
	const { account } = useContext(Web3Context);

	return (
		<header>
			{/* <Image src={swagcheck} /> */}
			<nav className="flex justify-around align-center">
				{!account ? (
					<MetaMask />
				) : (
					<>
						<GetTokens />
						<div className="">
							<h3 className="text-center py-1">Wallet Connected</h3>
							<button
								className="bg-blue-500 hover:bg-blue-600 btn"
								onClick={() => console.log(account)}
							>
								Check Account
							</button>
						</div>
					</>
				)}
			</nav>
		</header>
	);
};

export default NavBar;
