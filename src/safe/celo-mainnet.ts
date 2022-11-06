import { gnosis } from "../utils/gnosis";

export class CeloMainnet extends gnosis {
    chainName: string;
    chainLogo: string;

    constructor(safeAddress: string) {
        super(42220, 'https://safe-transaction.celo.gnosis.io/api/v1',  safeAddress)
        this.chainName = 'Celo Mainnet'
        this.chainLogo = 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/celo/info/logo.png'
    }

    getChainId(){
        return this.chainId
    }

    getChainName(){
        return this.chainName
    }
}