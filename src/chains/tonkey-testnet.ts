import { tonkey } from "../safes/tonkey";

export class TonKeyTestnet extends tonkey {
    chainName: string;
    chainLogo: string;
    safeLogo: string;

    constructor(safeAddress: string) {
        super(-3, 'https://graphql.tonkey.app/graphql', safeAddress)
        this.chainName = 'TON testnet'
        this.chainLogo = 'https://github.com/trustwallet/assets/blob/master/blockchains/ton/info/logo.png'
        this.safeLogo = '/v2/icons/tonkey.svg'
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