import { gnosis } from "../safes/gnosis";

export class GnosisMainnet extends gnosis {
    chainName: string;
    chainLogo: string;
    safeLogo: string;

    constructor(safeAddress: string) {
        super(100, 'https://safe-transaction.xdai.gnosis.io/', safeAddress)
        this.chainName = 'Ethereum Mainnet'
        this.chainLogo = 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/info/logo.png'
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
}