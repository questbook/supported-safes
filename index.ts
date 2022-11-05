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
    safes: any[];

    constructor () {
        // this.safes = [];
        // this.safes.push(new ArbitrumMainnet());
        // this.safes.push(new AuroraMainnet());
        // this.safes.push(new AvalancheMainnet());
        // this.safes.push(new BinanceMainnet());
        // this.safes.push(new CeloMainnet());
        // this.safes.push(new EnergyWebChain());
        // this.safes.push(new EnergyWebVolta());
        // this.safes.push(new EthereumMainnet());
        // this.safes.push(new GnosisMainnet());
        // this.safes.push(new GoerliTestnet());
        // this.safes.push(new OptimismMainnet());
        // this.safes.push(new PolygonMainnet());
        // this.safes.push(new RinkebyTestnet());
        // this.safes.push(new SolanaDevnet());
        // this.safes.push(new SolanaMainnet());
        // this.safes.push(new TelosMainnet());
    }

    getSafe(chainId: number, safeAddress: string) {

        switch (chainId) {
            case 1:
                return new EthereumMainnet(safeAddress);
            case 3:
                return new GoerliTestnet(safeAddress);
            case 4:
                return new RinkebyTestnet(safeAddress);
            case 5:
                return new GnosisMainnet(safeAddress);
        }

        // return this.safes.find(safe => safe.chainId === chainId);
    }

    getSafes() {
        return this.safes;
    }
}

//switch case on the chainId to create the safe object and return