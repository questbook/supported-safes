import { gnosis } from "../safes/gnosis";

export class EnergyWebVolta extends gnosis {
    chainName: string;
    chainLogo: string;
    safeLogo: string;

    constructor(safeAddress: string) {
        super(73799, 'https://safe-transaction.volta.gnosis.io/', safeAddress)
        this.chainName = 'Energy Web Volta'
        this.chainLogo = 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/energyweb/info/logo.png'
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