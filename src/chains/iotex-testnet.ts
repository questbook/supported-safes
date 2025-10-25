import { gnosis } from "../safes/gnosis";

export class IoTexTestnet extends gnosis {
    chainName: string;
    chainLogo: string;
    safeLogo: string;

    constructor(safeAddress: string, apiKey?: string) {
        super(4690, 'https://transaction-testnet.safe.iotex.io', safeAddress, apiKey)
        this.chainName = 'IoTex Testnet'
        this.chainLogo = 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/iotex/info/logo.png'
        this.safeLogo = '/safes_icons/iotex.svg'
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