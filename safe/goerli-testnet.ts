import { gnosis } from "../utils/gnosis";

export class GoerliTestnet extends gnosis {
    safeAddress : string;
    chainId: number;
    txnServiceURL: string;
    chainName: string;
    rpcURL: string;
    chainLogo: string;

    constructor() {
        super()
        this.chainId = 5
        this.txnServiceURL = 'https://safe-transaction.goerli.gnosis.io/api/v1'
        this.chainName = 'Goerli Testnet'
        this.rpcURL = 'https://goerli.prylabs.net'
        this.chainLogo = 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/info/logo.png'
    }
}