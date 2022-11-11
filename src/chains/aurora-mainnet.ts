import { gnosis } from "../safes/gnosis";

export class AuroraMainnet extends gnosis {
    chainName: string;
    chainLogo: string;

    constructor(safeAddress: string) {
        super(1313161554, 'https://safe-transaction.aurora.gnosis.io/', safeAddress);
        this.chainName = 'Aurora Mainnet'
        this.chainLogo = 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/aurora/info/logo.png'
    }

    getChainId(){
        return this.chainId
    }

    getChainName(){
        return this.chainName
    }
}