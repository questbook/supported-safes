import { realms } from "../utils/realms";

export class SolanaMainnet extends realms {
    safeAddress : string;
    chainId: number;
    txnServiceURL: string;
    chainName: string;
    rpcURL: string;
    chainLogo: string;

    constructor() {
        super()
        this.chainId = 900001
        this.txnServiceURL = 'https://safe-transaction.mainnet.solana.com/api/v1'
        this.chainName = 'Solana Mainnet'
        this.rpcURL = 'https://api.mainnet-beta.solana.com'
        this.chainLogo = 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/solana/info/logo.png'
    }
}