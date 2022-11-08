import { gnosis } from "../utils/gnosis";

export class AvalancheMainnet extends gnosis {
    chainName: string;
    chainLogo: string;

    constructor(safeAddress: string) {
        super(43114, 'https://safe-transaction.avalanche.gnosis.io/', safeAddress);
        this.chainName = 'Avalanche Mainnet'
        this.chainLogo = 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/avalanche/info/logo.png'
    }

    getChainId(){
        return this.chainId
    }

    getChainName(){
        return this.chainName
    }
}