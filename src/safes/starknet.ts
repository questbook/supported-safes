import { RpcProvider, Call, validateAndParseAddress } from 'starknet'
import { SafeDetailsInterface, SafeInterface, TokenDetailsInterface, errorMessage } from '../types/Safe';
import { getTokenUSDonDate } from '../utils/tokenConversionUtils';
export const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export class starknet implements SafeInterface {
    chainIdString: string
    chainId: number;
    rpcURL: string
    safeAddress: string
    provider: any
    starknetDecimals: number = 18
    starknetTokenId: string = 'ethererum'

    constructor(chainId: number, rpcURL: string, safeAddress: string) {
        this.chainId = chainId
        this.chainIdString = chainId.toString()
        this.rpcURL = rpcURL
        this.safeAddress = safeAddress
    }

    async getOwners(): Promise<string[]> {
        try {
            const rawAddr = (this.safeAddress);
            console.log(rawAddr)
            return [rawAddr]
        } catch (e) {
            console.log('error', e)
            throw new Error("error in getOwners")
        }
    }

    async isOwner(userAddress: string): Promise<boolean> {
        if (!userAddress || userAddress === '') {
            throw new Error("address is empty")
        }
        const owners = await this.getOwners()
        const userRawAddress = validateAndParseAddress(userAddress);
        const test = owners.includes(userRawAddress) ? true : false
        console.log('owners', owners, test, userRawAddress)
        return owners.includes(userRawAddress) ? true : false
    }

    async getToken(tokenAddress: string, address: string, tokenName: string): Promise<number> {
        const provider = new RpcProvider({ nodeUrl: this.rpcURL })

        const account = address;


        const tokenContract = tokenAddress;
        const accountContract = account;

        // Call the contract to get the account's balance
        const balanceCall: Call = {
          contractAddress: tokenContract,
          entrypoint: 'balanceOf',
          calldata: [ accountContract ],
        }
        const balanceResponse = await provider.callContract(balanceCall);

        // Call the contract to extract the decimals used in the balance
        const decimalCall: Call = {
          contractAddress: tokenContract,
          entrypoint: 'decimals',
        }
        const decimalResponse = await provider.callContract(decimalCall);

        const decimals = parseInt(decimalResponse.result[0].toString(), 16);
        const balance = parseInt(balanceResponse.result[0].toString(), 16) * 10 **-decimals;
        const currentTime = (new Date()).toLocaleDateString().split('/').join('-')
        const balanceInUSD = await getTokenUSDonDate(tokenName, currentTime)
        return balanceInUSD * balance ?? 0
    }




    async proposeTransaction(recipient: string, amount: number, wallet: any, remark: string): Promise<string | errorMessage> {

        // const accounts = await wallet.send('ton_requestAccounts')

        // const account = accounts[0]
        // const ownerIndex = await this.getOwnerIndex(account)

        // if (ownerIndex === -1) {
        //     throw new Error('Selected account is not an owner')
        // }

        // const token = await this.genToken(recipient, amount.toString(), wallet, ownerIndex, remark)

        // console.log('TON signed token: ', token)

        // return await this.createTransaction(token)
        return ''

    }

    async getSafeDetails(): Promise<SafeDetailsInterface> {
        const owners = await this.getOwners()
        if (!owners || owners.length == 0) {
            throw new Error("couldn't load owners")
        }
        const getEthBalance = await this.getToken('0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7', this.safeAddress, 'ethereum')
        const getUSDCBalance = await this.getToken('0x053c91253bc9682c04929ca02ed00b3e423f6710d2ee7e0d5ebb06f3ecf368a8', this.safeAddress, 'usd')
        const getSTRKBalance = await this.getToken('0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d', this.safeAddress, 'starknet')
        const balance = getEthBalance
        const usdcBalance = getUSDCBalance
        const strkBalance = getSTRKBalance
        return {
            networkName: "Starknet",
            safeAddress: this.safeAddress,
            isDisabled: false,
            owners: owners,
            amount: balance + usdcBalance + strkBalance,
            networkType: 3,
            networkId: this.chainId,
            safeType: 'Starknet',
            safeIcon: '/icons/braavos.svg'
        }
    }

    async getTokenAndbalance(): Promise<{ value?: TokenDetailsInterface[]; error?: string; }> {
        let list: TokenDetailsInterface[] = []
        const getEthBalance = await this.getToken('0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7', this.safeAddress, 'ethereum')
        const getUSDCBalance = await this.getToken('0x053c91253bc9682c04929ca02ed00b3e423f6710d2ee7e0d5ebb06f3ecf368a8', this.safeAddress, 'usd')
        const getSTRKBalance = await this.getToken('0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d', this.safeAddress, 'starknet')

        const currentTime = (new Date()).toLocaleDateString().split('/').join('-')

        const ethUsdRate = await getTokenUSDonDate('ethereum', currentTime)
        const usdcUsdRate = await getTokenUSDonDate('usd', currentTime)
        
        if(getSTRKBalance > 0) {
            const strkUsdRate = await getTokenUSDonDate('starknet', currentTime)
            list.push({
                tokenIcon: '/v2/icons/toncoin.svg',
                tokenName: 'STRK',
                tokenValueAmount: getSTRKBalance,
                usdValueAmount: getSTRKBalance * strkUsdRate,
                mintAddress: '0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d',
                info: {
                    decimals: 18,
                    tokenAddress: '0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d',
                    fiatConversion: strkUsdRate
                },
                fiatConversion: strkUsdRate,
                symbol: 'STRK'
            })
        }

        if(getUSDCBalance > 0) {
            list.push({
                tokenIcon: 'https://s2.coinmarketcap.com/static/img/coins/64x64/3408.png',
                tokenName: 'USDC',
                tokenValueAmount: getUSDCBalance,
                usdValueAmount: getUSDCBalance * usdcUsdRate,
                mintAddress: '0x053c91253bc9682c04929ca02ed00b3e423f6710d2ee7e0d5ebb06f3ecf368a8',
                info: {
                    decimals: 6,
                    tokenAddress: '0x053c91253bc9682c04929ca02ed00b3e423f6710d2ee7e0d5ebb06f3ecf368a8',
                    fiatConversion: usdcUsdRate
                },
                fiatConversion: usdcUsdRate,
                symbol: 'USDC'
            })
        }
        if(getEthBalance > 0) {
        list.push({
            tokenIcon: '/v2/icons/toncoin.svg',
            tokenName: 'ETH',
            tokenValueAmount: undefined,
            usdValueAmount: getEthBalance,
            mintAddress: undefined,
            info: undefined,
            fiatConversion: ethUsdRate,
            symbol: 'ETH'
        }) }
        console.log('list', list)
        return { value: list }
    }


    getNextSteps(): string[] {
        return ['Open the transaction on Braavos', 'Sign the newly created proposal', 'Ask all the multi-sig signers to sign the proposal']
    }

    async proposeTransactions(grantName: string, transactions: any[], wallet: any): Promise<string | errorMessage> {
        if (transactions.length === 0) {
            throw new Error('no transaction to propose')
        }
        else if (transactions.length > 1) {
            throw new Error('you cannot propose more than one builder/one milestone per transaction')
        }
        return await this.proposeTransaction(transactions[0].to, transactions[0].amount, wallet, grantName)
    }
}