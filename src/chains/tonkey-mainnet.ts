import { tonkey } from "../safes/tonkey";

export class TonKeyMainnet extends tonkey {
    chainName: string;
    chainLogo: string;
    safeLogo: string;

    constructor(safeAddress: string) {
        console.log('new version is here')
        super(-239, 'https://v1-graphql.tonkey.app/graphql', safeAddress)
        this.chainName = 'TON Mainnet'
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