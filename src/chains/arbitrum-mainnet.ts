import { gnosis } from "../safes/gnosis"

export class ArbitrumMainnet extends gnosis {
    chainName: string;
    chainLogo: string;

    constructor(safeAddress: string) {
        super(42161,'https://safe-transaction.arbitrum.gnosis.io/', safeAddress)
        this.chainName = 'Arbitrum Mainnet'
        this.chainLogo = 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/arbitrum/info/logo.png'
    }

    getChainId(){
        return this.chainId
    }

    getChainName(){
        return this.chainName
    }
}