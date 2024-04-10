import { starknet } from "../safes/starknet";

export class starknetMainnet extends starknet {
    chainName: string;
    chainLogo: string;
    safeLogo: string;

    constructor(safeAddress: string) {
        console.log('the new version')
        super(9004, 'https://starknet-mainnet.public.blastapi.io', safeAddress)
        this.chainName = 'Starknet Mainnet'
        this.chainLogo = 'https://s2.coinmarketcap.com/static/img/coins/200x200/22691.png'
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