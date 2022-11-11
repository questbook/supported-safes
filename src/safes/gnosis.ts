import { ethers, logger } from 'ethers'
import Safe, { ContractNetworksConfig } from '@gnosis.pm/safe-core-sdk'
import EthersAdapter from '@gnosis.pm/safe-ethers-lib'
import SafeServiceClient from '@gnosis.pm/safe-service-client'
import { getCeloTokenUSDRate } from '../utils/tokenConversionUtils';
import { erc20ABI } from 'wagmi'
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
		this.safeAddress = safeAddress
	}

	async proposeTransactions(grantName: string, initiateTransactionData: any, wallet: any): Promise<string| errorMessage>  {

		const readyToExecuteTxs = await createEVMMetaTransactions(this.chainId.toString(), initiateTransactionData)
		console.log('creating gnosis transaction for', readyToExecuteTxs)
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

			safeSdk = await Safe.create({ ethAdapter, safeAddress: this.safeAddress!, contractNetworks })

		} else {
			safeSdk = await Safe.create({ ethAdapter, safeAddress: this.safeAddress! })

		}

		try {
			const safeTransaction = await safeSdk.createTransaction({safeTransactionData: readyToExecuteTxs})

			const safeTxHash = await safeSdk.getTransactionHash(safeTransaction)
			const senderSignature = await safeSdk.signTransactionHash(safeTxHash)
			// console.log(await signer.getAddress())

			// console.log('safe address', safeAddress, safeTransaction.data, safeTxHash, senderSignature.data)

			await safeService.proposeTransaction({
				safeAddress: this.safeAddress!,
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
			return ({error: e.message})
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

	async getOwners (): Promise<string[]> {
		const gnosisUrl = `${this.rpcURL}/api/v1/safes/${this.safeAddress}`
		const response = await axios.get(gnosisUrl)
		return response.data.owners;
	}

	async getSafeDetails(): Promise<SafeDetailsInterface> {
		const tokenListAndBalance = await this.getTokenAndbalance();
		let usdAmount = 0;
		tokenListAndBalance.map((obj:any)=>{
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

	async getTokenAndbalance(): Promise<TokenDetailsInterface[]> {
		const tokenList: any[] = []
		const gnosisUrl = `${this.rpcURL}/api/v1/safes/${this.safeAddress}/balances/usd`
		const response = await axios.get(gnosisUrl)
		const tokensFetched = response.data
		tokensFetched.filter((token: any) => token.token).map((token: any) => {
			const tokenBalance = (ethers.utils.formatUnits(token.balance, token.token.decimals)).toString()
			tokenList.push({
				tokenIcon: token.token.logoUri,
				tokenName: token.token.symbol,
				tokenValueAmount: `${token.fiatBalance == '0.0' ? tokenBalance : `${token.fiatBalance} usd`}`,
				usdValueAmount: token.fiatBalance,
				mintAddress: '',
				info: {
					decimals: token.token.decimals,
					tokenAddress: token.tokenAddress,
					fiatConversion: token.fiatConversion
				},
			})
		})
		return tokenList;
	}

	getNextSteps(): string[] {
		return ['Open the transaction on Gnosis Safe', 'Sign the transaction created under the Queue section', 'Ask the other multi-sig signers to sign this transaction too']
	}
}