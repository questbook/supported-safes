import { gnosis } from "../utils/gnosis";

export class EnergyWebVolta extends gnosis {
    safeAddress : string;
    chainId: number;
    txnServiceURL: string;
    chainName: string;
    rpcURL: string;
    chainLogo: string;

    constructor() {
        super()
        this.chainId = 73799
        this.txnServiceURL = 'https://safe-transaction.energyweb-volta.gnosis.io/api/v1'
        this.chainName = 'Energy Web Volta'
        this.rpcURL = 'https://volta-rpc.energyweb.org'
        this.chainLogo = 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/energyweb/info/logo.png'
    }
}