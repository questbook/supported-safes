import { ethers } from 'ethers'
import Safe, { ContractNetworksConfig } from '@gnosis.pm/safe-core-sdk'
import EthersAdapter from '@gnosis.pm/safe-ethers-lib'
import SafeServiceClient from '@gnosis.pm/safe-service-client'

export class gnosis {

	chainId: number;
	rpcURL: string;
	safeAddress: string;

	constructor(chainId: number, rpcURL: string, safeAddress: string) {
		this.chainId = chainId
		this.rpcURL = rpcURL
		this.safeAddress = safeAddress
	}

    isValidRecipientAddress(address: String): Promise<boolean> {
		return new Promise((resolve, reject) => resolve(ethers.utils.isAddress(address.toString())))
	}
	getNextSteps(): string[] {
		return ['Open the transaction on Gnosis Safe', 'Sign the transaction created under the Queue section', 'Ask the other multi-sig signers to sign this transaction too']
	}
	initialiseAllProposals(): void {
		throw new Error('Method not implemented.')
	}

	proposeTransactions(grantName: string, transactions: any, wallet: any): Promise<string> {
		throw new Error('Method not implemented.')
	}

    async createMultiTransaction(transactions: any, safeAddress: string) {

		console.log('creating gnosis transaction for', transactions)
		//@ts-ignore
		const provider = new ethers.providers.Web3Provider(window.ethereum)
		await provider.send('eth_requestAccounts', [])

		const signer = provider.getSigner()
		const ethAdapter = new EthersAdapter({
			ethers,
			signer,
		})
		const safeService = new SafeServiceClient({ txServiceUrl: this.rpcURL, ethAdapter })
		// const safeFactory = await SafeFactory.create({ ethAdapter })
		let safeSdk

		if (this.chainId === 40) {
			const id = await ethAdapter.getChainId()
			const contractNetworks: ContractNetworksConfig = {
				[id]: {
					multiSendAddress: '0xA238CBeb142c10Ef7Ad8442C6D1f9E89e07e7761',
					safeMasterCopyAddress: '0xe591ae490dcc235f420fb7ae3239e0df3ae2048f',
					safeProxyFactoryAddress: '0xa6B71E26C5e0845f74c812102Ca7114b6a896AB2',
					multiSendCallOnlyAddress: '0x40A2aCCbd92BCA938b02010E17A5b8929b49130D'
				}
			}

			safeSdk = await Safe.create({ ethAdapter, safeAddress, contractNetworks })

		} else {
			safeSdk = await Safe.create({ ethAdapter, safeAddress })

		}

		try {
			const safeTransaction = await safeSdk.createTransaction({safeTransactionData: transactions})

			const safeTxHash = await safeSdk.getTransactionHash(safeTransaction)
			const senderSignature = await safeSdk.signTransactionHash(safeTxHash)
			// console.log(await signer.getAddress())

			// console.log('safe address', safeAddress, safeTransaction.data, safeTxHash, senderSignature.data)

			await safeService.proposeTransaction({
				safeAddress,
				safeTransactionData: safeTransaction.data,
				safeTxHash,
				senderAddress: senderSignature.signer,
				senderSignature: senderSignature.data
			})

			return safeTxHash
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
		} catch (e: any) {
			// return undefined
			console.log(e)
		}


	}

    async isOwner(safeAddress: string): Promise<boolean> {
		//@ts-ignore
		const provider = new ethers.providers.Web3Provider(window.ethereum)
		await provider.send('eth_requestAccounts', [])

		const signer = provider.getSigner()
		const ethAdapter = new EthersAdapter({
			ethers,
			signer,
		})

		let safeSdk

		if (this.chainId === 40) {
			const id = await ethAdapter.getChainId()
			const contractNetworks: ContractNetworksConfig = {
				[id]: {
					multiSendAddress: '0xA238CBeb142c10Ef7Ad8442C6D1f9E89e07e7761',
					safeMasterCopyAddress: '0xe591ae490dcc235f420fb7ae3239e0df3ae2048f',
					safeProxyFactoryAddress: '0xa6B71E26C5e0845f74c812102Ca7114b6a896AB2',
					multiSendCallOnlyAddress: '0x40A2aCCbd92BCA938b02010E17A5b8929b49130D'
				}
			}

			safeSdk = await Safe.create({ ethAdapter, safeAddress, contractNetworks })

		} else {
			safeSdk = await Safe.create({ ethAdapter, safeAddress })

		}

		const userAddress = await signer.getAddress()
		return await safeSdk.isOwner(userAddress)
	}

    async getTransactionHashStatus(safeTxHash: string): Promise<any> {

		const safeAddress = this.safeAddress
		// const safeTxnHash = "0x6b93a22e3929062eadf085a6a150d6bf59d0690ff93b0921cbe1c313708be83c"
		//@ts-ignore
		const provider = new ethers.providers.Web3Provider(window.ethereum)
		await provider.send('eth_requestAccounts', [])

		const signer = provider.getSigner()
		const ethAdapter = new EthersAdapter({
			ethers,
			signer,
		})
		const safeService = new SafeServiceClient({ txServiceUrl: this.rpcURL, ethAdapter })
		const txnDetails = await safeService.getTransaction(safeTxHash)
		if (txnDetails.isExecuted) {
			return { ...txnDetails, status: 1 }
		} else {
			return null
		}
	}


	async getSafeDetails(address: String): Promise<any> {
		//@ts-ignore
		const provider = new ethers.providers.Web3Provider(window.ethereum)
		await provider.send('eth_requestAccounts', [])

		const signer = provider.getSigner()
		const ethAdapter = new EthersAdapter({
			ethers,
			signer,
		})
		const safeService = new SafeServiceClient({ txServiceUrl: this.rpcURL, ethAdapter })
		const balanceInUsd = await safeService.getUsdBalances(this.safeAddress)
		return balanceInUsd
	}
}