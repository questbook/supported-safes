import { CeloMainnet } from "./safe/celo-mainnet";
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
        switch (chainId) {
            case 42220:
                return new CeloMainnet(safeAddress);
            case 1:
                return new EthereumMainnet(safeAddress);
            case 137:
                return new GnosisMainnet(safeAddress);
            case 5:
                return new GoerliTestnet(safeAddress);
            case 10:
                return new OptimismMainnet(safeAddress);
            case 137:
                return new PolygonMainnet(safeAddress);
            case 4:
                return new RinkebyTestnet(safeAddress);
            case 900002:
                return new SolanaDevnet(safeAddress);
            case 900001:
                return new SolanaMainnet(safeAddress);
            case 40:
                return new TelosMainnet(safeAddress);
        }
    }    
}