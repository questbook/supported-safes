import { gnosis } from "../safes/gnosis";

export class CeloMainnet extends gnosis {
    chainName: string;
    chainLogo: string;
    safeLogo: string;

    constructor(safeAddress: string) {
        super(42220, 'https://transaction-service.gnosis-safe-staging.celo-networks-dev.org/',  safeAddress)
        this.chainName = 'Celo Mainnet'
        this.chainLogo = 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/celo/info/logo.png'
        this.safeLogo = '/safes_icons/celo.svg'
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