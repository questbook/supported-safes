import { gnosis } from "../utils/gnosis";

export class OptimismMainnet extends gnosis {
    safeAddress : string;
    chainId: number;
    txnServiceURL: string;
    chainName: string;
    rpcURL: string;
    chainLogo: string;

    constructor() {
        super()
        this.chainId = 10
        this.txnServiceURL = 'https://safe-transaction.optimism.io/api/v1'
        this.chainName = 'Optimism Mainnet'
        this.rpcURL = 'https://mainnet.optimism.io'
        this.chainLogo = 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/optimism/info/logo.png'
    }
}