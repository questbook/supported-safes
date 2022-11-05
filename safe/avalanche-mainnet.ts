import { gnosis } from "../utils/gnosis";

export class AvalancheMainnet extends gnosis {
    safeAddress : string;
    chainId: number;
    txnServiceURL: string;
    chainName: string;
    rpcURL: string;
    chainLogo: string;

    constructor() {
        super()
        this.chainId = 43114
        this.txnServiceURL = 'https://safe-transaction.avax.network/api/v1'
        this.chainName = 'Avalanche Mainnet'
        this.rpcURL = 'https://api.avax.network/ext/bc/C/rpc'
        this.chainLogo = 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/avalanche/info/logo.png'
    }
}