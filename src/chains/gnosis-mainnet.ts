import { gnosis } from "../safes/gnosis";

export class GnosisMainnet extends gnosis {
    chainName: string;
    chainLogo: string;
    safeLogo: string;

    constructor(safeAddress: string, apiKey?: string) {
        super(100, 'https://safe-transaction-gnosis-chain.safe.global/', safeAddress, apiKey)
        this.chainName = 'Ethereum Mainnet'
        this.chainLogo = 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/info/logo.png'
        this.safeLogo = '/safes_icons/safe.svg'
    }

    getChainId(){
        return this.chainId
    }

    getChainName(){
        return this.chainName
    }

    getIsEvm(){
        return true;
    }
    getIsTon(){
        return false
    }
}