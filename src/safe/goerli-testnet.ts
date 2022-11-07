import { gnosis } from "../utils/gnosis";

export class GoerliTestnet extends gnosis {

    chainName = 'Goerli Testnet'
    chainLogo = 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/info/logo.png'
    // constructor(safeAddress: string) {
    //     super(5, 'https://safe-transaction.goerli.gnosis.io/api/', safeAddress);
    //     this.chainName = 'Goerli Testnet'
    //     this.chainLogo = 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/info/logo.png'
    // }

    getChainId(){
        return this.chainId
    }

    getChainName(){
        return this.chainName
    }
}