import { gnosis } from "../utils/gnosis";

export class OptimismMainnet extends gnosis {
    chainName: string;
    chainLogo: string;

    constructor(safeAddress: string) {
        super(10, 'https://safe-transaction.optimism.io/api/v1', safeAddress)
        this.chainName = 'Optimism Mainnet'
        this.chainLogo = 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/optimism/info/logo.png'
    }

    getChainId(){
        return this.chainId
    }

    getChainName(){
        return this.chainName
    }
}