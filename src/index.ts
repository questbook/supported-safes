import SupportedSafesInfo from "./constants/supported-safe";
export class SupportedSafes {

    getSafe(chainId: number, safeAddress: string) {
        const safeInfo = SupportedSafesInfo[chainId];
        if (safeInfo) {
            return new safeInfo.class(safeAddress);
        }
    }
    
    async getSafeByAddress(address: string) {
        let safeData = [];
        const CHAIN_IDS = Object.keys(SupportedSafesInfo);

        for (let i = 0; i < CHAIN_IDS.length; i++) {
            const chainId = parseInt(CHAIN_IDS[i]);
            const safeInfo = SupportedSafesInfo[chainId];
            if(address){        
                try{
                    const safe = new safeInfo.class(address);
                    const res = await safe.getSafeDetails();
                    if (res) {
                        safeData.push({...res, networkName: safe.chainName, networkIcon: safe.chainLogo});
                    }
                }catch(e){
                    console.log(e)
                }
            }
        }

        return safeData;
    }
}