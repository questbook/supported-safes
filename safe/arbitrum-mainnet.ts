import { gnosis } from "../utils/gnosis"

export class ArbitrumMainnet extends gnosis {
    safeAddress : string;
    chainId: number;
    txnServiceURL: string;
    chainName: string;
    rpcURL: string;
    chainLogo: string;

    constructor() {
        super(42161,'https://safe-transaction.arbitrum.gnosis.io/api/v1', this.safeAddress)
        this.chainId = 42161
        this.txnServiceURL = 'https://safe-transaction.arbitrum.gnosis.io/api/v1'
        this.chainName = 'Arbitrum Mainnet'
        this.rpcURL = 'https://arb1.arbitrum.io/rpc'
        this.chainLogo = 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/arbitrum/info/logo.png'
    }
}