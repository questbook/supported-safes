import { gnosis } from "../utils/gnosis";

export class PolygonMainnet extends gnosis {
    safeAddress : string;
    chainId: number;
    txnServiceURL: string;
    chainName: string;
    rpcURL: string;
    chainLogo: string;

    constructor() {
        super()
        this.chainId = 137
        this.txnServiceURL = 'https://safe-transaction.polygon.gnosis.io/api/v1'
        this.chainName = 'Polygon Mainnet'
        this.rpcURL = 'https://rpc-mainnet.maticvigil.com/'
        this.chainLogo = 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/polygon/info/logo.png'
    }
}