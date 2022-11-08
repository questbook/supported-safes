import SupportedSafesInfo from "./constants/supported-safe";
import { ArbitrumMainnet } from "./safe/arbitrum-mainnet";
import { AuroraMainnet } from "./safe/aurora-mainnet";
import { AvalancheMainnet } from "./safe/avalanche-mainnet";
import { BinanceMainnet } from "./safe/binance-mainnet";
import { CeloMainnet } from "./safe/celo-mainnet";
import { EnergyWebChain } from "./safe/energy-web-chain";
import { EnergyWebVolta } from "./safe/energy-web-volta";
import { EthereumMainnet } from "./safe/ethereum-mainnet";
import { GnosisMainnet } from "./safe/gnosis-mainnet";
import { GoerliTestnet } from "./safe/goerli-testnet";
import { OptimismMainnet } from "./safe/optimism-mainnet";
import { PolygonMainnet } from "./safe/polygon-mainnet";
import { RinkebyTestnet } from "./safe/rinkeby-testnet";
import { SolanaDevnet } from "./safe/solana-devnet";
import { SolanaMainnet } from "./safe/solana-mainnet";
import { TelosMainnet } from "./safe/telos-mainnet";

export class SupportedSafes {

    getSafe(chainId: number, safeAddress: string) {
        const safeInfo = SupportedSafesInfo[chainId];
        if (!safeInfo) {
            return new safeInfo.class(safeAddress);
        }
        // switch (chainId) {
        //     case 42161:
        //         return new ArbitrumMainnet(safeAddress);
        //     case 1313161554:
        //         return new AuroraMainnet(safeAddress);
        //     case 43114:
        //         return new AvalancheMainnet(safeAddress);
        //     case 56:
        //         return new BinanceMainnet(safeAddress);
        //     case 42220:
        //         return new CeloMainnet(safeAddress);
        //     case 246:
        //         return new EnergyWebChain(safeAddress);
        //     case 73799:
        //         return new EnergyWebVolta(safeAddress);
        //     case 1:
        //         return new EthereumMainnet(safeAddress);
        //     case 137:
        //         return new GnosisMainnet(safeAddress);
        //     case 5:
        //         return new GoerliTestnet(safeAddress);
        //     case 10:
        //         return new OptimismMainnet(safeAddress);
        //     case 137:
        //         return new PolygonMainnet(safeAddress);
        //     case 4:
        //         return new RinkebyTestnet(safeAddress);
        //     case 900002:
        //         return new SolanaDevnet(safeAddress);
        //     case 900001:
        //         return new SolanaMainnet(safeAddress);
        //     case 40:
        //         return new TelosMainnet(safeAddress);
        // }
    }
    
    getSafeByAddress(safeAddress: string) {
        
    }
}