import {
	getAllTokenOwnerRecords,
	getGovernanceAccounts,
	getGovernanceProgramVersion,
	getNativeTreasuryAddress,
	getRealm,
	Governance,
	ProgramAccount,
	Proposal,
	pubkeyFilter,
	TokenOwnerRecord,
	VoteType,
	withCreateProposal,
} from '@solana/spl-governance';
import { Connection, GetProgramAccountsFilter, PublicKey, TransactionInstruction } from '@solana/web3.js';
import { TOKEN_PROGRAM_ID } from "@solana/spl-token"
import axios from 'axios';
import { solanaToUsd, solanaToUsdRate } from '../utils/tokenConversionUtils';
import { solTokenTrxn, splTokenTrxn } from '../utils/realmsUtils';
import { errorMessage, SafeDetailsInterface, SafeInterface, TokenDetailsInterface } from '../types/Safe';

export class realms implements SafeInterface {

	chainId: number;
	rpcURL: string;
	safeAddress: string;
	connection: Connection;
	programId: PublicKey;
	allProposals: ProgramAccount<Proposal>[];

	constructor(chainId: number, rpcURL: string, safeAddress: string) {
		this.chainId = chainId;
		this.rpcURL = rpcURL;
		this.safeAddress = safeAddress;
		this.connection = new Connection(rpcURL);
		console.log('this.connection', this.connection)
		this.programId = new PublicKey('GovER5Lthms3bLBqWub97yVrMmEogzX7xNjdXpPPCVZw');
		this.allProposals = [];
	}

	async proposeTransactions(grantname: string, transactions: any[], wallet: any): Promise<string|errorMessage> {
		console.log('transactions', transactions, wallet.publicKey.toString())
		try{
			const safeAddressPublicKey = new PublicKey(this.safeAddress!);
			const realmData = await getRealm(this.connection, safeAddressPublicKey)
			const governances = await getGovernanceAccounts(
                this.connection, 
                this.programId, 
                Governance, 
                [pubkeyFilter(1, safeAddressPublicKey)!,
			])
            

			console.log("realms governances", governances.map((g)=>g.pubkey.toString()))

			const governance = governances.filter((gov)=>gov.pubkey.toString()===realmData.account.authority?.toString())[0]
			const payer : PublicKey = wallet.publicKey

			console.log("realms governance", governance.pubkey.toString())

			const tokenOwnerRecordTrial = await getAllTokenOwnerRecords(
				this.connection,
				realmData.owner,
				realmData.pubkey
			)

			console.log("realms tokenOwnerRecordTrial", tokenOwnerRecordTrial.map((t)=>t.pubkey.toString()))

			const tokenOwnerRecord  = await getGovernanceAccounts(
				this.connection,
				this.programId,
				TokenOwnerRecord,
				[pubkeyFilter(1, realmData.pubkey)!, pubkeyFilter(65, payer)!]
			);

			console.log("realms tokenOwnerRecord", tokenOwnerRecord[0].pubkey.toString())
			console.log("realms tokenOwnerRecord governingTokenMint", tokenOwnerRecord[0].account.governingTokenMint.toString())

			const programVersion = await getGovernanceProgramVersion(this.connection, this.programId)
			
			const proposalInstructions: TransactionInstruction[] = []

			const proposalAddress = await withCreateProposal(
				proposalInstructions,
				this.programId,
				programVersion,
				safeAddressPublicKey,
				governance.pubkey,
				tokenOwnerRecord[0].pubkey,
				`${transactions.length > 1 ? 'Batched Payout - ' : ''} ${grantname} - ${new Date().toDateString()}`,
				`${grantname}`,
				tokenOwnerRecord[0].account.governingTokenMint,
				payer!,
				0,
				VoteType.SINGLE_CHOICE,
				['Approve'],
				true,
				payer!
			)

			const nativeTreasury = await getNativeTreasuryAddress(this.programId, governance.pubkey)

			if(transactions[0].selectedToken.tokenName==="SOL"){
				await solTokenTrxn(
					this.connection,
					this.programId,
					this.safeAddress,
					programVersion,
					transactions, 
					nativeTreasury, 
					proposalInstructions, 
					governance, 
					proposalAddress,
					tokenOwnerRecord,
					payer)
			}else{
				await splTokenTrxn(
					this.connection,
					this.programId,
					this.safeAddress,
					programVersion,
					wallet,
					transactions, 
					nativeTreasury, 
					proposalInstructions, 
					governance, 
					proposalAddress,
					tokenOwnerRecord,
					payer)
			}

			return proposalAddress.toString()
		}catch(e: any){
			console.log('error', e)
			return ({error: e.message})
		}	
	}

	async isOwner(address: String): Promise<any> {
		try{
			const safeAddressPublicKey = new PublicKey(this.safeAddress!);
			const tokenownerrecord = await getAllTokenOwnerRecords(this.connection, this.programId, safeAddressPublicKey)
			let isOwner = false
			for(let i = 0; i < tokenownerrecord.length; i++) {
				if(tokenownerrecord[i].account.governingTokenOwner.toString() === address) {
					isOwner = true
					break
				}
			}

			return isOwner
		}catch(e: any){
			console.log('error', e)
			return ({error: e.message})
		}	
	}

	async getOwners (): Promise<string[] | errorMessage> {
		const connection = new Connection(this.rpcURL!, 'recent')
		const programId = new PublicKey('GovER5Lthms3bLBqWub97yVrMmEogzX7xNjdXpPPCVZw')

		try {
			const safeAddressPublicKey = new PublicKey(this.safeAddress!)
			const tokenownerrecord = await getAllTokenOwnerRecords(connection, programId, safeAddressPublicKey)
			return tokenownerrecord.map(record => record.account.governingTokenOwner.toString())
		} catch(e:any){
			console.log('error', e)
			return ({error: e.message})
		}
	}

	getSafeDetails = async(): Promise<SafeDetailsInterface> => {
		const tokenListAndBalance = await this.getTokenAndbalance();
		if (tokenListAndBalance?.error) {
			console.log(tokenListAndBalance?.error, 'getSafeDetails error')
			return undefined
		}
		let usdAmount = 0;
		tokenListAndBalance?.value?.map((obj:any)=>{
			usdAmount += obj.usdValueAmount
		})
		const owners = await this.getOwners();
		return {
			safeAddress: this.safeAddress,
			networkType: 2,
			networkId: this.chainId,
			safeType: 'Realms',
			safeIcon: '/safes_icons/realms.svg',
			amount: usdAmount, // 1000
			isDisabled: false,
			owners: owners as string[],
		}
	}

	async getTokenAndbalance (): Promise<{value?: TokenDetailsInterface[], error?: string}>{

		try{
			let tokenList:any[] = [];

			const safeAddressPublicKey = new PublicKey(this.safeAddress!);
			const connection = new Connection(this.rpcURL!, 'recent')
			console.log(connection)
			const programId = new PublicKey('GovER5Lthms3bLBqWub97yVrMmEogzX7xNjdXpPPCVZw')
			const realmsPublicKey = safeAddressPublicKey
			const realmData = await getRealm(connection, realmsPublicKey)
			const governances = await getGovernanceAccounts(connection, programId, Governance, [
				pubkeyFilter(1, safeAddressPublicKey)!,
			])
			const governance = governances.filter((gov)=>gov.pubkey.toString()===realmData.account.authority?.toString())[0]
			const nativeTreasuryAddress = await getNativeTreasuryAddress(programId, governance.pubkey)
			const solAmount = (await connection.getAccountInfo(nativeTreasuryAddress))!.lamports / 1000000000
			const solUSDRate = await solanaToUsdRate()

			tokenList.push( {
				tokenIcon: '/network_icons/solana.svg',
				tokenName: 'SOL',
				tokenValueAmount: solAmount,
				usdValueAmount: solUSDRate * solAmount, 
				mintAddress: nativeTreasuryAddress,
				info: undefined,
				fiatConversion: solUSDRate
			})

			const filters:GetProgramAccountsFilter[] = [
				{
				dataSize: 165,
				},
				{
				memcmp: {
					offset: 32,    
					bytes: nativeTreasuryAddress.toString(),  
				}            
				}
			];
			const treasuryAccInfo = await connection.getParsedProgramAccounts(TOKEN_PROGRAM_ID, {filters:filters})

			const allTokens = []
			const allTokenList = []
			
			await Promise.all(treasuryAccInfo.map(async (info: any)=>{
					const tokenInfo = info.account.data?.parsed?.info;
					const tokenCoinGeckoInfo = allTokenList.find((x)=>x.address===tokenInfo?.mint)
					const tokenUsdValue = await axios.get(
						`https://api.coingecko.com/api/v3/simple/price?ids=${tokenCoinGeckoInfo?.extensions?.coingeckoId}&vs_currencies=usd`
					)

					if(tokenInfo?.mint && tokenCoinGeckoInfo && tokenUsdValue?.data){
						tokenList.push( {
							tokenIcon: tokenCoinGeckoInfo.logoURI,
							tokenName: tokenCoinGeckoInfo.name,
							symbol: tokenCoinGeckoInfo.name, 
							tokenValueAmount: tokenInfo?.tokenAmount?.uiAmount,
							usdValueAmount: tokenInfo?.tokenAmount?.uiAmount * tokenUsdValue?.data[tokenCoinGeckoInfo.extensions?.coingeckoId!]?.usd, 
							mintAddress: tokenInfo?.mint,
							info: tokenInfo,
							fiatConversion: tokenUsdValue?.data[tokenCoinGeckoInfo.extensions?.coingeckoId!]?.usd
						})	
					}
				}))
			

			return {value: tokenList};
		}catch(e:any){
			console.log('error', e)
			return ({error: e.message})
		}
	}

	getNextSteps(): string[] {
		return ['Open the transaction on Realms', 'Sign the newly created proposal', 'Ask all the multi-sig signers to sign the proposal']
	}
}
