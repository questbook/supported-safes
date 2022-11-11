export interface SafeInterface {
    chainId: number;
    rpcURL: string;
    safeAddress: string | undefined;
    proposeTransactions(grantName: string, initiateTransactionData: any, wallet: any): Promise<any>;
    isOwner(safeAddress: string): Promise<boolean>;
    getOwners (): Promise<any>;
    getSafeDetails(): Promise<any>;
    getTokenAndbalance(): Promise<any>;
    getNextSteps(): string[];
}