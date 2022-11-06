import { gnosis } from "../utils/gnosis";

export class EthereumMainnet extends gnosis {
    chainName: string;
    chainLogo: string;

    constructor(safeAddress: string) {
        super(1, 'https://safe-transaction.ethereum.gnosis.io/api/v1', safeAddress)
        this.chainName = 'Ethereum Mainnet'
        this.chainLogo = 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/info/logo.png'
    }

    getChainId(){
        return this.chainId
    }

    getChainName(){
        return this.chainName
    }
}