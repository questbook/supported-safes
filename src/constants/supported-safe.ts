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

const SupportedSafesInfo: {[chainId: number]: any} = {
    1: {
        name: "Ethereum Mainnet",
        chainId: 1,
        rpcURL: "https://safe-transaction.mainnet.gnosis.io/",
        class: EthereumMainnet,
    },
    4: {
        name: "Rinkeby Testnet",
        chainId: 4,
        rpcURL: "https://safe-transaction.rinkeby.gnosis.io/",
        class: RinkebyTestnet,
    },
    5: {
        name: "Goerli Testnet",
        chainId: 5,
        rpcURL: "https://safe-transaction.goerli.gnosis.io/",
        class: GoerliTestnet,
    },
    10: {
        name: "Optimism Mainnet",
        chainId: 10,
        rpcURL: "https://safe-transaction.optimism.gnosis.io/",
        class: OptimismMainnet,
    },
    40: {
        name: "Telos Mainnet",
        chainId: 40,
        rpcURL: "https://transaction.safe.telos.net",
        class: TelosMainnet,
    },
    56: {
        name: "Binance Mainnet",
        chainId: 56,
        className: "BinanceMainnet",
        rpcURL: "https://safe-transaction.bsc.gnosis.io/",
        class: BinanceMainnet,
    },
    137: {
        name: "Polygon Mainnet",
        chainId: 137,
        rpcURL: "https://safe-transaction.polygon.gnosis.io/",
        class: PolygonMainnet,
    },
    246: {
        name: "Energy Web Chain",
        chainId: 246,
        rpcURL: "https://safe-transaction.ewc.gnosis.io/",
        class: EnergyWebChain,
    },
    73799: {
        name: "Energy Web Volta",
        chainId: 73799,
        rpcURL: "https://safe-transaction.volta.gnosis.io/",
        class: EnergyWebVolta,
    },
    42161: {
        name: "Arbitrum Mainnet",
        chainId: 42161,
        rpcURL: "https://safe-transaction.arbitrum.gnosis.io/",
        class: ArbitrumMainnet,
    },
    43114: {
        name: "Avalanche Mainnet",
        chainId: 43114,
        rpcURL: "https://safe-transaction.avalanche.gnosis.io/",
        class: AvalancheMainnet,
    },
    42220: {
        name: "Celo Mainnet",
        chainId: 42220,
        rpcURL: "https://transaction-service.gnosis-safe-staging.celo-networks-dev.org/",
        class: CeloMainnet,
    },
    1313161554: {
        name: "Aurora Mainnet",
        chainId: 1313161554,
        rpcURL: "https://safe-transaction.aurora.gnosis.io/",
        class: AuroraMainnet,
    },
    100: {
        name: "Gnosis",
        chainId: 100,
        rpcURL: "https://safe-transaction.xdai.gnosis.io/",
        class: GnosisMainnet,
    },
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