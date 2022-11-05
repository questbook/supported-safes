import { gnosis } from "../utils/gnosis";

export class CeloMainnet extends gnosis {
    safeAddress : string;
    chainId: number;
    txnServiceURL: string;
    chainName: string;
    rpcURL: string;
    chainLogo: string;

    constructor() {
        super()
        this.chainId = 42220
        this.txnServiceURL = 'https://safe-transaction.celo.gnosis.io/api/v1'
        this.chainName = 'Celo Mainnet'
        this.rpcURL = 'https://forno.celo.org'
        this.chainLogo = 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/celo/info/logo.png'
    }
}