import { gnosis } from "../utils/gnosis";

export class TelosMainnet extends gnosis {
    safeAddress : string;
    chainId: number;
    txnServiceURL: string;
    chainName: string;
    rpcURL: string;
    chainLogo: string;

    constructor() {
        super()
        this.chainId = 40
        this.txnServiceURL = 'https://safe-transaction.telos.gnosis.io/api/v1'
        this.chainName = 'Telos Mainnet'
        this.rpcURL = 'https://telos.eosphere.io'
        this.chainLogo = 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/telos/info/logo.png'
    }
}