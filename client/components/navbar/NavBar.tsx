import { useContext } from 'react';
import { Web3Context } from '../Web3Context';

import MetaMask from './MetaMask';
import GetTokens from './GetTokens';
import TotalEarnings from './TotalEarnings';

const NavBar: React.FC = () => {
	const { account } = useContext(Web3Context);

	return (
		<header className="text-center mb-10 mt-1">
			<nav className="flex justify-around align-center">
				{!account ? (
					<MetaMask />
				) : (
					<>
						<GetTokens />
						<TotalEarnings />
						<div>
							<h3 className="py-1">Wallet Connected ✅</h3>
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
