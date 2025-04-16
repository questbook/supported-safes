import { ethers, logger } from 'ethers'
import Safe, { ContractNetworksConfig } from '@safe-global/safe-core-sdk'
import { SafeTransaction } from '@safe-global/safe-core-sdk-types';
import EthersAdapter from '@safe-global/safe-ethers-lib'
import SafeServiceClient from '@safe-global/safe-service-client'
import { getCeloTokenUSDRate } from '../utils/tokenConversionUtils';
import axios from 'axios';
import { createEVMMetaTransactions } from '../utils/gnosisUtils';
import { errorMessage, SafeDetailsInterface, SafeInterface, TokenDetailsInterface } from '../types/Safe';

export class gnosis implements SafeInterface {

	chainId: number;
	rpcURL: string;
	safeAddress: string | undefined;

	constructor(chainId: number, rpcURL: string, safeAddress: string) {
		this.chainId = chainId
		this.rpcURL = rpcURL
		this.safeAddress = ethers.utils.getAddress(safeAddress)
	}

	async proposeTransactions(extraData: string, initiateTransactionData: any, wallet: any): Promise<string | errorMessage> {
		try {
			// Input validation
			if (!extraData || !initiateTransactionData || !wallet) {
				return { error: 'Missing required parameters' }
			}

			let parsedExtraData;
			try {
				parsedExtraData = JSON.parse(extraData)
			} catch (e) {
				return { error: 'Invalid extraData format' }
			}

			const { workspaceId, grantAddress } = parsedExtraData
			if (!workspaceId || grantAddress) {
				return { error: 'Invalid workspaceId or grantAddress' }
			}

			const readyToExecuteTxs = await createEVMMetaTransactions(workspaceId, grantAddress, this.chainId.toString(), initiateTransactionData)
			console.log('creating gnosis transaction for (edited)', readyToExecuteTxs)

			//@ts-ignore
			const provider = new ethers.providers.Web3Provider(wallet || window.ethereum)
			await provider.send('eth_requestAccounts', [])

			const signer = provider.getSigner()
			const currentChain = await signer.getChainId()
			if (currentChain !== this.chainId) {
				console.log("you're on the wrong chain")
				return { error: "you're on the wrong chain" }
			}

			const ethAdapter = new EthersAdapter({
				ethers,
				signerOrProvider: signer,
			})
			const safeService = new SafeServiceClient({ txServiceUrl: this.rpcURL, ethAdapter })
			let safeSdk: Safe

			// Keep existing contract network configurations
			if (this.chainId === 40) {
				const id = await ethAdapter.getChainId()
				const contractNetworks: ContractNetworksConfig = {
					[id]: {
						multiSendAddress: '0xA238CBeb142c10Ef7Ad8442C6D1f9E89e07e7761',
						safeMasterCopyAddress: '0xe591ae490dcc235f420fb7ae3239e0df3ae2048f',
						safeProxyFactoryAddress: '0xa6B71E26C5e0845f74c812102Ca7114b6a896AB2',
						multiSendCallOnlyAddress: '0x40A2aCCbd92BCA938b02010E17A5b8929b49130D',
						createCallAddress: '',
						fallbackHandlerAddress: '',
						signMessageLibAddress: '',
					}
				}
				safeSdk = await Safe.create({ ethAdapter, safeAddress: this.safeAddress!, contractNetworks })
			} else if (this.chainId === 4689) {
				// IoTeX Mainnet configuration
				const id = await ethAdapter.getChainId()
				const contractNetworks: ContractNetworksConfig = {
					[id]: {
						multiSendAddress: '0x998739BFdAAdde7C933B942a68053933098f9EDa',
						safeMasterCopyAddress: '0x69f4D1788e39c87893C980c06EdF4b7f686e2938',
						safeProxyFactoryAddress: '0xC22834581EbC8527d974F8a1c97E1bEA4EF910BC',
						multiSendCallOnlyAddress: '0xA1dabEF33b3B82c7814B6D82A79e50F4AC44102B',
						createCallAddress: '0xB19D6FFc2182150F8Eb585b79D4ABcd7C5640A9d',
						fallbackHandlerAddress: '0x017062a1dE2FE6b99BE3d9d37841FeD19F573804',
						signMessageLibAddress: '0x98FFBBF51bb33A056B08ddf711f289936AafF717'
					}
				}
				safeSdk = await Safe.create({ ethAdapter, safeAddress: this.safeAddress!, contractNetworks })
			} else if (this.chainId === 4690) {
				// IoTeX Testnet configuration
				const id = await ethAdapter.getChainId()
				const contractNetworks: ContractNetworksConfig = {
					[id]: {
						multiSendAddress: '0x3965413148aD58Caa782c54F2695df9087b9d9Db',
						safeMasterCopyAddress: '0xa3238D50fc88866B7740dbdE817A4e6556998eB5',
						safeProxyFactoryAddress: '0xe6A900e5a57aD203e102F4dE7A7fA8Dc189CecD2',
						multiSendCallOnlyAddress: '0x53010C9D478586675EfcfA3bb3cf6E574b89587B',
						createCallAddress: '0xf0f5c82aB98Ae91DBAef416c41bf52DBF9Fe79f8',
						fallbackHandlerAddress: '0xa772301E1122aE5Fa906c4e3aA795e754b5d649C',
						signMessageLibAddress: '0x150e2D832F6035ac8B3c3af6F394303a652556dc'
					}
				}
				safeSdk = await Safe.create({ ethAdapter, safeAddress: this.safeAddress!, contractNetworks })
			}

			try {
				// Get current nonce from API
				const nonceURL = `${this.rpcURL}/api/v1/safes/${this.safeAddress}/`
				const { data: nonceData } = await axios.get(nonceURL)
				if (!nonceData?.nonce) {
					throw new Error('Could not fetch current nonce')
				}
				let nextNonce = parseInt(nonceData.nonce)
				const initialNonce = nextNonce

				// Check for pending transactions
				do {
					const nonceURL = `${this.rpcURL}/api/v1/safes/${this.safeAddress}/multisig-transactions/?nonce=${nextNonce}&ordering=submissionDate`
					const nonceResponse = await axios.get(nonceURL)
					console.log(nonceResponse, 'Nonce response')
					if (nonceResponse.data?.count === 0) break
					++nextNonce

					if (nextNonce - initialNonce > 10) throw new Error('Too many pending transactions')
				} while (true)

				// Transaction building with validation
				let safeTransactionData
				const MAX_VALUE = ethers.utils.parseEther('1000000') // 1M ETH equivalent

				if (Array.isArray(readyToExecuteTxs) && readyToExecuteTxs.length > 1) {
					// Validate batch transactions
					for (const tx of readyToExecuteTxs) {
						if (!ethers.utils.isAddress(tx.to)) {
							return { error: `Invalid address: ${tx.to}` }
						}
						if (ethers.BigNumber.from(tx.value || '0').gt(MAX_VALUE)) {
							return { error: 'Transaction value exceeds limit' }
						}
					}

					// Handle batch transactions
					const multiSendTxs = readyToExecuteTxs.map(tx => ({
						to: tx.to,
						value: tx.value || '0',
						data: tx.data,
						operation: tx.operation || 0
					}))

					// Get appropriate MultiSend contract address
					const multiSendContract = this.chainId === 4689
						? '0x998739BFdAAdde7C933B942a68053933098f9EDa'  // IoTeX mainnet
						: this.chainId === 4690
							? '0x3965413148aD58Caa782c54F2695df9087b9d9Db' // IoTeX testnet
							: '0x40A2aCCbd92BCA938b02010E17A5b8929b49130D' // Default

					// Create the encoded data for the multi-send transaction
					const multiSendInterface = new ethers.utils.Interface([
						'function multiSend(bytes transactions)'
					])

					// Pack the transactions into the required format
					const packedTransactions = ethers.utils.hexConcat(
						multiSendTxs.map(tx => {
							return ethers.utils.solidityPack(
								['uint8', 'address', 'uint256', 'uint256', 'bytes'],
								[
									tx.operation,
									tx.to,
									tx.value,
									ethers.utils.arrayify(tx.data).length,
									tx.data
								]
							)
						})
					)

					// Encode the final multi-send call
					const encodedMultiSendData = multiSendInterface.encodeFunctionData('multiSend', [
						ethers.utils.hexConcat(['0x', packedTransactions])
					])

					safeTransactionData = {
						to: multiSendContract,
						value: '0',
						data: encodedMultiSendData,
						operation: 1, // DelegateCall for MultiSend
						safeTxGas: 0,
						baseGas: 0,
						gasPrice: 0,
						gasToken: ethers.constants.AddressZero,
						refundReceiver: ethers.constants.AddressZero,
						nonce: nextNonce
					}
				} else {
					// Validate single transaction
					const tx = Array.isArray(readyToExecuteTxs) ? readyToExecuteTxs[0] : readyToExecuteTxs
					if (!ethers.utils.isAddress(tx.to)) {
						return { error: `Invalid address: ${tx.to}` }
					}
					if (ethers.BigNumber.from(tx.value || '0').gt(MAX_VALUE)) {
						return { error: 'Transaction value exceeds limit' }
					}

					safeTransactionData = {
						to: tx.to,
						value: tx.value || '0',
						data: tx.data,
						operation: tx.operation || 0,
						safeTxGas: 0,
						baseGas: 0,
						gasPrice: 0,
						gasToken: ethers.constants.AddressZero,
						refundReceiver: ethers.constants.AddressZero,
						nonce: nextNonce
					}
				}

				// Enhanced validation
				if (!safeTransactionData.to || !safeTransactionData.gasToken || !safeTransactionData.refundReceiver) {
					if (!safeTransactionData.to) {
						return { error: 'to address is required' }
					}
					if (!safeTransactionData.gasToken) {
						return { error: 'gasToken address is required' }
					}
					if (!safeTransactionData.refundReceiver) {
						return { error: 'refundReceiver address is required' }
					}
				}

				// Enhanced signature creation with replay protection
				const domain = {
					chainId: await signer.getChainId(),
					verifyingContract: this.safeAddress
				}

				const types = {
					SafeTx: [
						{ name: 'to', type: 'address' },
						{ name: 'value', type: 'uint256' },
						{ name: 'data', type: 'bytes' },
						{ name: 'operation', type: 'uint8' },
						{ name: 'safeTxGas', type: 'uint256' },
						{ name: 'baseGas', type: 'uint256' },
						{ name: 'gasPrice', type: 'uint256' },
						{ name: 'gasToken', type: 'address' },
						{ name: 'refundReceiver', type: 'address' },
						{ name: 'nonce', type: 'uint256' }
					]
				}

				const message = {
					to: safeTransactionData.to,
					value: safeTransactionData.value,
					data: safeTransactionData.data,
					operation: safeTransactionData.operation,
					safeTxGas: safeTransactionData.safeTxGas,
					baseGas: safeTransactionData.baseGas,
					gasPrice: safeTransactionData.gasPrice,
					gasToken: safeTransactionData.gasToken,
					refundReceiver: safeTransactionData.refundReceiver,
					nonce: safeTransactionData.nonce
				}

				const signature = await signer._signTypedData(domain, types, message)
				const contractTransactionHash = ethers.utils._TypedDataEncoder.hash(domain, types, message)

				// Submit transaction
				try {
					const proposeURL = `${this.rpcURL}/api/v1/safes/${this.safeAddress}/multisig-transactions/`
					await axios.post(proposeURL, {
						safe: this.safeAddress,
						to: safeTransactionData.to,
						value: safeTransactionData.value,
						data: safeTransactionData.data,
						operation: safeTransactionData.operation,
						safeTxGas: safeTransactionData.safeTxGas,
						baseGas: safeTransactionData.baseGas,
						gasPrice: safeTransactionData.gasPrice,
						gasToken: safeTransactionData.gasToken,
						refundReceiver: safeTransactionData.refundReceiver,
						nonce: safeTransactionData.nonce,
						contractTransactionHash,
						safeTxHash: contractTransactionHash,
						sender: await signer.getAddress(),
						signature
					})
					return contractTransactionHash
				} catch (e: any) {
					console.error('Transaction proposal error:', e)
					return { error: e.message || 'Unknown error occurred' }
				}
			} catch (e: any) {
				console.error('Transaction setup error:', e)
				return { error: e.message || 'Unknown error occurred' }
			}
		} catch (e: any) {
			console.error('Transaction setup error:', e)
			return { error: e.message || 'Unknown error occurred' }
		}
	}

	async isOwner(userAddress: string, walletProvider?: any): Promise<boolean> {
		try {
			// Initialize provider with wallet
			//@ts-ignore
			const provider = new ethers.providers.Web3Provider(walletProvider || window.ethereum)
			await provider.send('eth_requestAccounts', [])

			const signer = provider.getSigner()
			const currentChain = await signer.getChainId()
			
			// Verify correct chain
			if (currentChain !== this.chainId) {
				console.error("Wrong chain detected")
				return false
			}

			// Get connected address
			const connectedAddress = await signer.getAddress()
			
			// Verify the provided address matches the connected wallet
			if (connectedAddress.toLowerCase() !== userAddress.toLowerCase()) {
				console.error("Connected wallet doesn't match provided address")
				return false
			}

			// Get safe owners from API
			const response = await fetch(`${this.rpcURL}/api/v1/safes/${this.safeAddress}`)
			const safeInfo = await response.json()
			
			if (!safeInfo.owners || !Array.isArray(safeInfo.owners)) {
				console.error('Invalid owners data from Safe')
				return false
			}

			// Check if connected address is an owner
			const isOwner = safeInfo.owners
				.map((owner: string) => owner.toLowerCase())
				.includes(connectedAddress.toLowerCase())

			console.log('Safe ownership verification:', {
				safeAddress: this.safeAddress,
				connectedAddress,
				isOwner
			})

			return isOwner

		} catch (error) {
			console.error('Error verifying owner:', error)
			return false
		}
	}

	async getOwners (): Promise<string[]> {
		const gnosisUrl = `${this.rpcURL}/api/v1/safes/${this.safeAddress}`
		const response = await axios.get(gnosisUrl)
		return response.data.owners;
	}

	async getSafeDetails(): Promise<SafeDetailsInterface> {
		const tokenListAndBalance = await this.getTokenAndbalance();
		if (tokenListAndBalance?.error) {
			console.log('Error', tokenListAndBalance.error)
			return undefined
		}
		let usdAmount = 0;
		tokenListAndBalance?.value?.map((obj:any)=>{
			usdAmount += obj.usdValueAmount
		})
		const owners = await this.getOwners();
		return {
			safeAddress: this.safeAddress!,
			networkType: 1,
			networkId: this.chainId,
			safeType: 'Gnosis',
			safeIcon: '/safes_icons/gnosis.svg',
			amount: usdAmount, // 1000
			isDisabled: false,
			owners: owners,
		}
	}

	async getTokenAndbalance(): Promise<{value?: TokenDetailsInterface[], error?: string}> {
		const tokenList: any[] = []
		const gnosisUrl = `https://safe-client.safe.global/v1/chains/${this.chainId}/safes/${this.safeAddress}/balances/usd`
		const response = await axios.get(gnosisUrl)
		const tokensFetched = response.data.items
		const celoTokensUSDRateMapping = await (await getCeloTokenUSDRate()).data;
		Promise.all(
			tokensFetched.filter((token: any) => token.tokenInfo).map((token: any) => {
				console.log('token', token)
				let tokenUSDRate = 0;
				if(token.tokenInfo.symbol === 'cUSD') {
					tokenUSDRate = celoTokensUSDRateMapping['celo-dollar'].usd
				} else if(token.tokenInfo.symbol === 'CELO') {
					tokenUSDRate = celoTokensUSDRateMapping['celo'].usd
				} else if(token.tokenInfo.symbol === 'cEURO') {
					tokenUSDRate = celoTokensUSDRateMapping['celo-euro'].usd
				} else if(token.tokenInfo.symbol === 'tether') {
					token = celoTokensUSDRateMapping['tether'].usd
				} else if(token.tokenInfo.symbol === 'spcusd') {
					tokenUSDRate = 0
				} else if(token.tokenInfo.symbol === 'spCELO') {
					tokenUSDRate = 0
				} else if(token.tokenInfo.symbol === 'USDC') {
					token.fiatConversion = 1;
					tokenUSDRate = 1;
				}
				const tokenBalance = parseFloat(ethers.utils.formatUnits(token.balance, token.tokenInfo.decimals))
				const tokenUSDBalance = parseFloat(token.fiatBalance) > 0 ? parseFloat(token.fiatBalance) : tokenBalance*tokenUSDRate
				tokenList.push({
					tokenIcon: token.tokenInfo.logoUri,
					tokenName: token.tokenInfo.symbol,
					tokenValueAmount: tokenBalance,
					isNative: token.tokenInfo.type === 'NATIVE_TOKEN' ? true : false,
					usdValueAmount: tokenUSDBalance,
					mintAddress: '',
					fiatConversion: parseFloat(token.fiatConversion) > 0  ? parseFloat(token.fiatConversion) : tokenUSDRate,
					info: {
						decimals: token.tokenInfo.decimals,
						tokenAddress: token.tokenInfo.address,
						fiatConversion: !token.fiatConversion && parseFloat(token.fiatConversion) === 0  ? tokenUSDRate : parseFloat(token.fiatConversion)
					},
				})
			})
		);
		
		console.log('tokenList', tokenList)
		return {value: tokenList};
	}

	getNextSteps(): string[] {
		return ['Open the transaction on Gnosis Safe', 'Sign the transaction created under the Queue section', 'Ask the other multi-sig signers to sign this transaction too']
	}
}