import { PublicKey } from "@solana/web3.js";

export interface errorMessage{
    error: string
}
export interface MilestoneInterface {
    amount: string;
    amountPaid: string;
    id: string;
    state: string;
    title: string;
    updatedAtS: number;
}

export interface SelectedTokenInterface{
    name: string;
    info: {
        isNative?: boolean;
        mint?: string;
        owner?: string;
        state?: string;
        tokenAmount?: {
            amount?: string;
            decimals?: number;
            uiAmount?: number;
            uiAmountString?: string;
        }
        decimals?: number;
        fiatConversion?: string;
        tokenAddress?: string;
    }
}

export interface TransactionDataInterface {
    from: string
    to: string
    amount: number
    applicationId: number
    selectedMilestone: MilestoneInterface
    selectedToken: SelectedTokenInterface
}

export interface ConnectOpts {
    onlyIfTrusted: boolean
}

export type PhantomEvent = 'disconnect' | 'connect' | 'accountChanged';

export interface PhantomProvider {
    connect: (opts?: Partial<ConnectOpts>) => Promise<{ publicKey: PublicKey }>
    disconnect: () => Promise<void>
    on: (event: PhantomEvent, callback: (args: any) => void) => void
    isPhantom: boolean
	publicKey: PublicKey
	isConnected: boolean
}

export interface SafeDetailsInterface {
    networkName?: string;
    networkIcon?: string;
    safeAddress: string;
    networkType: number;
    networkId: number;
    safeType: string;
    safeIcon: string;
    amount: number;
    isDisabled: boolean,
    owners: string[],
}

export interface TokenDetailsInterface {
    tokenIcon: string
    tokenName: string
    symbol: string
    isNative?: boolean
    tokenValueAmount: number
    usdValueAmount: number
    mintAddress: string
    info: {
        decimals: number
        tokenAddress: string
        fiatConversion: number
    }
    fiatConversion: number
}

export interface SafeInterface {
    chainId: number;
    rpcURL: string;
    safeAddress: string | undefined;
    proposeTransactions(grantName: string, initiateTransactionData: TransactionDataInterface[], wallet: PhantomProvider|''): Promise<string | errorMessage>;
    isOwner(safeAddress: string): Promise<boolean>;
    getOwners (): Promise<string[] | errorMessage>;
    getSafeDetails(): Promise<SafeDetailsInterface>;
    getTokenAndbalance(): Promise<{value?: TokenDetailsInterface[], error?: string}>;
    getNextSteps(): string[];
}