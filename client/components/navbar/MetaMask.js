import { useContext } from 'react';
import { Web3Context } from '../Web3Context';
import artifact from '../../../artifacts/contracts/CoinFlip.sol/CoinFlip.json';

const MetaMask = () => {
	const { setContract, setProvider, ethers, setAccount } =
		useContext(Web3Context);

	async function enableEth() {
		try {
			if (window.ethereum) {
				const provider = new ethers.providers.Web3Provider(window.ethereum);
				const [account] = await ethereum.request({
					method: 'eth_requestAccounts'
				});
				const signer = provider.getSigner(account);
				const contract = new ethers.Contract(
					'0x124dDf9BdD2DdaD012ef1D5bBd77c00F05C610DA',
					artifact.abi,
					signer
				);

				setProvider(provider);
				setContract(contract);
				setAccount(contract.signer._address);
			} else if (window.web3) {
				console.log('Update MetaMask');
			} else {
				console.log('Enable MetaMask');
			}
		} catch (e) {
			console.log(e);
		}
	}

	return (
		<div>
			<button
				className="btn bg-green-400 hover:bg-green-600 mt-8"
				onClick={enableEth}
			>
				Connect Wallet
			</button>
		</div>
	);
};

export default MetaMask;
