import { gnosis } from "../utils/gnosis";

export class GnosisMainnet extends gnosis {
    chainName: string;
    chainLogo: string;

    constructor(safeAddress: string) {
        super(100, 'https://safe-transaction.gnosis.io/api/v1', safeAddress)
        this.chainName = 'Ethereum Mainnet'
        this.chainLogo = 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/info/logo.png'
    }

    getChainId(){
        return this.chainId
    }

    getChainName(){
        return this.chainName
    }
}