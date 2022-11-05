import { gnosis } from "../utils/gnosis";

export class EnergyWebChain extends gnosis {
    safeAddress : string;
    chainId: number;
    txnServiceURL: string;
    chainName: string;
    rpcURL: string;
    chainLogo: string;

    constructor() {
        super()
        this.chainId = 246
        this.txnServiceURL = 'https://safe-transaction.energyweb.org/api/v1'
        this.chainName = 'Energy Web Chain'
        this.rpcURL = 'https://rpc.energyweb.org'
        this.chainLogo = 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/energyweb/info/logo.png'
    }
}