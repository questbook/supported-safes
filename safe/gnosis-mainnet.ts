import { gnosis } from "../utils/gnosis";

export class GnosisMainnet extends gnosis {
    safeAddress : string;
    chainId: number;
    txnServiceURL: string;
    chainName: string;
    rpcURL: string;
    chainLogo: string;

    constructor() {
        super()
        this.chainId = 100
        this.txnServiceURL = 'https://safe-transaction.gnosis.io/api/v1'
        this.chainName = 'Ethereum Mainnet'
        this.rpcURL = 'https://mainnet.infura.io/v3/5aa3d95b3bc440fa88ea12eaa4456161'
        this.chainLogo = 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/info/logo.png'
    }
}