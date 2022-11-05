import { gnosis } from "../utils/gnosis";

export class AuroraMainnet extends gnosis {
    safeAddress : string;
    chainId: number;
    txnServiceURL: string;
    chainName: string;
    rpcURL: string;
    chainLogo: string;

    constructor() {
        super()
        this.chainId = 1313161554
        this.txnServiceURL = 'https://safe-transaction.aurora.dev.gnosisdev.com/api/v1'
        this.chainName = 'Aurora Mainnet'
        this.rpcURL = 'https://rpc.aurora.dev'
        this.chainLogo = 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/aurora/info/logo.png'
    }
}