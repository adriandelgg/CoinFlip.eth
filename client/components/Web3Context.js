import React, { createContext, useState, useEffect } from 'react';
import { ethers } from 'ethers';

export const Web3Context = createContext();
const oneEther = ethers.BigNumber.from('1000000000000000000');

const Web3Provider = ({ children }) => {
	const [contract, setContract] = useState(null);
	const [provider, setProvider] = useState(null);
	const [account, setAccount] = useState('');

	// Listens for a change in account and updates state
	useEffect(() => {
		if (contract && provider) {
			ethereum.on('accountsChanged', newAccount);
			return () => ethereum.removeListener('accountsChanged', newAccount);
		}
	});

	function newAccount(accounts) {
		window.location.reload();
		// setContract(contract.connect(provider.getSigner(accounts[0])));
		// setAccount(accounts[0]);
	}

	// Listens for network changes to reload the page
	useEffect(() => {
		ethereum.on('chainChanged', handleChainChanged);
		return () => ethereum.removeListener('chainChanged', handleChainChanged);
	}, []);

	function handleChainChanged(chainId) {
		window.location.reload();
	}

	return (
		<Web3Context.Provider
			value={{
				ethers,
				provider,
				setProvider,
				contract,
				setContract,
				account,
				setAccount,
				oneEther
			}}
		>
			{children}
		</Web3Context.Provider>
	);
};

export default Web3Provider;
