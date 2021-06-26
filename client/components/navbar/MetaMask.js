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
					'0x5FbDB2315678afecb367f032d93F642f64180aa3',
					artifact.abi,
					signer
				);
				setProvider(provider);
				setContract(contract);
				setAccount(account);
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
				className="bg-green-400 hover:bg-green-600 text-white font-bold py-1 px-4 rounded"
				onClick={enableEth}
			>
				Connect Wallet
			</button>
		</div>
	);
};

export default MetaMask;
