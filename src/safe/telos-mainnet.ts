import { gnosis } from "../utils/gnosis";

export class TelosMainnet extends gnosis {
    chainName: string;
    chainLogo: string;

    constructor(safeAddress: string) {
        super(40, 'https://safe-transaction.telos.gnosis.io/api/v1', safeAddress)
        this.chainName = 'Telos Mainnet'
        this.chainLogo = 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/telos/info/logo.png'
    }

    getChainId(){
        return this.chainId
    }

    getChainName(){
        return this.chainName
    }
}