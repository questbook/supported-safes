import { TonWallet } from "../wallets/TON";

const SupportedWalletsInfo: {[wallet: string]: any} = {
    'TON Wallet': {
        class: TonWallet,
        name: 'TON',
        logo: '/wallet_icons/ton.svg',
    }
}

export default SupportedWalletsInfo