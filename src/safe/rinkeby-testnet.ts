import { gnosis } from "../utils/gnosis";

export class RinkebyTestnet extends gnosis {
    chainName: string;
    chainLogo: string;

    constructor(safeAddress: string) {
        super(4, 'https://safe-transaction.rinkeby.gnosis.io/', safeAddress)
        this.chainName = 'Rinkeby Testnet'
        this.chainLogo = 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/info/logo.png'
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
}