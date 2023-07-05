import { gnosis } from "../safes/gnosis";

export class BinanceMainnet extends gnosis {
    chainName: string;
    chainLogo: string;
    safeLogo: string;

    constructor(safeAddress: string) {
        super(56, 'https://safe-transaction-bsc.safe.global/', safeAddress);
        this.chainName = 'Binance Smart Chain'
        this.chainLogo = 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/binance/info/logo.png'
        this.safeLogo = '/safes_icons/safe.svg'
    }

    getChainId(){
        return this.chainId
    }

    getChainName(){
        return this.chainName
    }

    getIsEvm(){
        return true;
    }
    getIsTon(){
        return false
    }
}