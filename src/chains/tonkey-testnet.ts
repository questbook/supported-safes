import { tonkey } from "../safes/tonkey";

export class TonKeyTestnet extends tonkey {
    chainName: string;
    chainLogo: string;
    safeLogo: string;

    constructor(safeAddress: string) {
        super(-3, 'https://graphql.tonkey.app/graphql', safeAddress)
        this.chainName = 'TON testnet'
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
        return true
    }
}