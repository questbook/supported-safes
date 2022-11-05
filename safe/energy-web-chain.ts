import { gnosis } from "../utils/gnosis";

export class EnergyWebChain extends gnosis {
    chainName: string;
    chainLogo: string;

    constructor(safeAddress: string) {
        super(246, 'https://safe-transaction.energyweb.org/api/v1', safeAddress)
        this.chainName = 'Energy Web Chain'
        this.chainLogo = 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/energyweb/info/logo.png'
    }

    getChainId(){
        return this.chainId
    }

    getChainName(){
        return this.chainName
    }
}