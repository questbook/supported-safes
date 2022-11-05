import { realms } from "../utils/realms";

export class SolanaDevnet extends realms {
    safeAddress : string;
    chainId: number;
    txnServiceURL: string;
    chainName: string;
    rpcURL: string;
    chainLogo: string;

    constructor() {
        super()
        this.chainId = 900002
        this.txnServiceURL = 'https://safe-transaction.devnet.solana.com/api/v1'
        this.chainName = 'Solana Devnet'
        this.rpcURL = 'https://api.devnet.solana.com'
        this.chainLogo = 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/solana/info/logo.png'
    }
}