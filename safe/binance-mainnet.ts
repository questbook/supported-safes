import { gnosis } from "../utils/gnosis";

export class BinanceMainnet extends gnosis {
    safeAddress : string;
    chainId: number;
    txnServiceURL: string;
    chainName: string;
    rpcURL: string;
    chainLogo: string;

    constructor() {
        super()
        this.chainId = 56
        this.txnServiceURL = 'https://safe-transaction.bsc.gnosis.io/api/v1'
        this.chainName = 'Binance Smart Chain'
        this.rpcURL = 'https://bsc-dataseed.binance.org/'
        this.chainLogo = 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/binance/info/logo.png'
    }
}