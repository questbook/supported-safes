import { realms } from "../safes/realms";

export class SolanaMainnet extends realms {
    chainName: string;
    chainLogo: string;
    safeLogo: string;

    constructor(safeAddress: string) {
        super(900001, 'https://dark-palpable-flower.solana-mainnet.discover.quiknode.pro/d845a24ffa7b087476ceb108a9dd42b6b0bd103b/', safeAddress)
        this.chainName = 'Solana Mainnet'
        this.chainLogo = 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/solana/info/logo.png'
        this.safeLogo = '/safes_icons/realms.svg'
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
    getIsTon(){
        return false
    }
}