import { EthereumMainnet } from "./chains/ethereum-mainnet";
import { SolanaMainnet } from "./chains/solana-mainnet";
import { TonKeyMainnet } from "./chains/tonkey-mainnet";
import SupportedSafesInfo from "./constants/supported-safe";
import SupportedWalletsInfo from "./constants/supported-wallets";
import { SafeDetailsInterface } from "./types/Safe";
import { TonWallet } from "./wallets/TON";
export class SupportedPayouts {

    getSafe(chainId: number, safeAddress: string): EthereumMainnet | SolanaMainnet| TonKeyMainnet {
        const safeInfo = SupportedSafesInfo[chainId];
        if (safeInfo) {
            return new safeInfo.class(safeAddress);
        }
    }
    
    async getSafeByAddress(address: string, callback: (value: SafeDetailsInterface[])=>void) {
        const CHAIN_IDS = Object.keys(SupportedSafesInfo);
        const safes = await Promise.all(CHAIN_IDS.map(async (chainId) => {
            const safeInfo: {name: string, chainId: number, rpcURL: string, class: typeof EthereumMainnet | typeof SolanaMainnet | typeof TonKeyMainnet} = SupportedSafesInfo[chainId];
            console.log(safeInfo, chainId)
            if(address){        
                try{
                    const safe = new safeInfo.class(address);
                    const res = await safe.getSafeDetails();
                    console.log(chainId, res)
                    if (res) {
                        return {...res, networkName: safe.chainName, networkIcon: safe.chainLogo}
                    }
                } catch(e){
                    console.log(e)
                }
            }
        }));

        callback(safes.filter((safe) => safe !== undefined));
    }

    getAllWallets(): TonWallet[] {
        return Object.keys(SupportedWalletsInfo).map((wallet) => {
            const walletInfo = SupportedWalletsInfo[wallet];
            return new walletInfo.class();
        });
    }

    getWallet(walletName: string): TonWallet {
        const walletInfo = SupportedWalletsInfo[walletName];
        if (walletInfo) {
            return new walletInfo.class();
        }
    }
}