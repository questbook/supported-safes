import { realms } from "../utils/realms";

export class SolanaMainnet extends realms {
    chainName: string;
    chainLogo: string;

    constructor(safeAddress: string) {
        super(900001, 'https://safe-transaction.mainnet.solana.com/api/v1', safeAddress)
        this.chainName = 'Solana Mainnet'
        this.chainLogo = 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/solana/info/logo.png'
    }

    getChainId(){
        return this.chainId
    }

    getChainName(){
        return this.chainName
    }
}