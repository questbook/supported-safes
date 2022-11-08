import { realms } from "../utils/realms";

export class SolanaDevnet extends realms {
    chainName: string;
    chainLogo: string;

    constructor(safeAddress: string) {
        super(900002, 'https://mango.devnet.rpcpool.com', safeAddress)
        this.chainName = 'Solana Devnet'
        this.chainLogo = 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/solana/info/logo.png'
    }

    getChainId(){
        return this.chainId
    }

    getChainName(){
        return this.chainName
    }

    getIsEvm(){
        return false;
    }
}