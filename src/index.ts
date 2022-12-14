import SupportedSafesInfo from "./constants/supported-safe";
import SupportedWalletsInfo from "./constants/supported-wallets";
export class SupportedPayouts {

    getSafe(chainId: number, safeAddress: string) {
        const safeInfo = SupportedSafesInfo[chainId];
        if (safeInfo) {
            return new safeInfo.class(safeAddress);
        }
    }
    
    async getSafeByAddress(address: string, callback: (value: any)=>void) {
        const CHAIN_IDS = Object.keys(SupportedSafesInfo);

        Promise.all(CHAIN_IDS.map(async (chainId) => {
            const safeInfo = SupportedSafesInfo[chainId];
            if(address){        
                try{
                    const safe = new safeInfo.class(address);
                    const res = await safe.getSafeDetails();
                    if (res) {
                        callback([{...res, networkName: safe.chainName, networkIcon: safe.chainLogo}])
                    }
                }catch(e){
                    console.log(e)
                }
            }
        })).then((values)=>{
            // callback(values.filter(Boolean))
        })
    }

    getAllWallets() {
        return Object.keys(SupportedWalletsInfo).map((wallet) => {
            const walletInfo = SupportedWalletsInfo[wallet];
            return new walletInfo.class();
        });
    }

    getWallet(walletName: string) {
        const walletInfo = SupportedWalletsInfo[walletName];
        if (walletInfo) {
            return new walletInfo.class();
        }
    }
}