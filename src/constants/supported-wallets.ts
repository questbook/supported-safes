import { TonWallet } from "../wallets/TON";

const SupportedWalletsInfo: {[wallet: string]: {class: typeof TonWallet, name: string, logo: string}} = {
    'TON Wallet': {
        class: TonWallet,
        name: 'TON',
        logo: '/wallet_icons/ton.svg',
    }
}

export default SupportedWalletsInfo