import { gnosis } from "../utils/gnosis";

export class RinkebyTestnet extends gnosis {
    safeAddress : string;
    chainId: number;
    txnServiceURL: string;
    chainName: string;
    rpcURL: string;
    chainLogo: string;

    constructor() {
        super()
        this.chainId = 4
        this.txnServiceURL = 'https://safe-transaction.rinkeby.gnosis.io/api/v1'
        this.chainName = 'Rinkeby Testnet'
        this.rpcURL = 'https://rinkeby.infura.io/v3/4d8b0c6e4f6a4c3e8e8d2c6d5b7e0d9c'
        this.chainLogo = 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/info/logo.png'
    }
}