import { realms } from "../utils/realms";

export class SolanaMainnet extends realms {
    chainName: string;
    chainLogo: string;

    constructor(safeAddress: string) {
        super(900001, 'https://dark-palpable-flower.solana-mainnet.discover.quiknode.pro/d845a24ffa7b087476ceb108a9dd42b6b0bd103b/', safeAddress)
        this.chainName = 'Solana Mainnet'
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