import { ArbitrumMainnet } from "../chains/arbitrum-mainnet"
import { AuroraMainnet } from "../chains/aurora-mainnet"
import { AvalancheMainnet } from "../chains/avalanche-mainnet"
import { BinanceMainnet } from "../chains/binance-mainnet"
import { CeloMainnet } from "../chains/celo-mainnet"
import { EnergyWebChain } from "../chains/energy-web-chain"
import { EnergyWebVolta } from "../chains/energy-web-volta"
import { EthereumMainnet } from "../chains/ethereum-mainnet"
import { GnosisMainnet } from "../chains/gnosis-mainnet"
import { GoerliTestnet } from "../chains/goerli-testnet"
import { OptimismMainnet } from "../chains/optimism-mainnet"
import { PolygonMainnet } from "../chains/polygon-mainnet"
import { RinkebyTestnet } from "../chains/rinkeby-testnet"
import { SolanaDevnet } from "../chains/solana-devnet"
import { SolanaMainnet } from "../chains/solana-mainnet"
import { TelosMainnet } from "../chains/telos-mainnet"

const SupportedSafesInfo: {[chainId: number]: {name: string, chainId: number, rpcURL: string, class: any}} = {
    900001: {
        name: "Solana Mainnet",
        chainId: 900001,
        rpcURL: "https://dark-palpable-flower.solana-mainnet.discover.quiknode.pro/d845a24ffa7b087476ceb108a9dd42b6b0bd103b/",
        class: SolanaMainnet,
    },
    900002: {
        name: "Solana Devnet",
        chainId: 900002,
        rpcURL: "https://mango.devnet.rpcpool.com",
        class: SolanaDevnet,
    },
}

export default SupportedSafesInfo