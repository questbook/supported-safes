import SupportedSafesInfo from "./constants/supported-safe";
export class SupportedSafes {

    getSafe(chainId: number, safeAddress: string) {
        const safeInfo = SupportedSafesInfo[chainId];
        if (safeInfo) {
            return new safeInfo.class(safeAddress);
        }
    }
    
    getSafeByAddress(safeAddress: string) {
        
    }
}