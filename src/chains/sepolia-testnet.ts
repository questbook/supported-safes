import { gnosis } from "../safes/gnosis";

export class SepoliaTestnet extends gnosis {
    chainName: string;
    chainLogo: string;
    safeLogo: string;

    constructor(safeAddress: string) {
        super(11155111, 'https://safe-transaction-sepolia.safe.global/', safeAddress);
        this.chainName = 'Sepolia Testnet'
        this.chainLogo = 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/info/logo.png'
        this.safeLogo = '/v2/icons/safe.svg'
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