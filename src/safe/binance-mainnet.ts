import { gnosis } from "../utils/gnosis";

export class BinanceMainnet extends gnosis {
    chainName: string;
    chainLogo: string;

    constructor(safeAddress: string) {
        super(56, 'https://safe-transaction.bsc.gnosis.io/', safeAddress);
        this.chainName = 'Binance Smart Chain'
        this.chainLogo = 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/binance/info/logo.png'
    }

    getChainId(){
        return this.chainId
    }

    getChainName(){
        return this.chainName
    }
}