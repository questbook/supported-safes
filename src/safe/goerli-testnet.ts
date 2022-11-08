import { gnosis } from "../utils/gnosis";

export class GoerliTestnet extends gnosis {
    chainName: string;
    chainLogo: string;

    constructor(safeAddress: string) {
        super(5, 'https://safe-transaction.goerli.gnosis.io/', safeAddress);
        this.chainName = 'Goerli Testnet'
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