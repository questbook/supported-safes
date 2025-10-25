import { gnosis } from "../safes/gnosis";

export class BaseMainnet extends gnosis {
    chainName: string;
    chainLogo: string;
    safeLogo: string;

    constructor(safeAddress: string, apiKey?: string) {
        super(8453, 'https://safe-transaction-base.safe.global/', safeAddress, apiKey);
        this.chainName = 'Base Mainnet'
        this.chainLogo = 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/base/info/logo.png'
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