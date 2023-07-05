import TonWeb from 'tonweb';
import { PhantomProvider, SafeDetailsInterface, SafeInterface, TokenDetailsInterface, TransactionDataInterface, errorMessage } from '../types/Safe';
export const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export class tonkey implements SafeInterface {
    chainIdString: string
    chainId: number;
    rpcURL: string
    safeAddress: string
    provider: any

    constructor(chainId: number, rpcURL: string, safeAddress: string) {
        this.chainId = chainId
        this.chainIdString = chainId.toString()
        this.rpcURL = rpcURL
        this.safeAddress = safeAddress
    }

    toRawAddress(address: string): string {
        return new TonWeb.Address(address).toString(false);
    }

    async getOwners(): Promise<string[]> {
        try {
            const rawAddr = this.toRawAddress(this.safeAddress);
            console.log(rawAddr)
            const reqVar = {
                chainId: this.chainIdString,
                safeAddress: rawAddr,
            };
            const response = await fetch(`${this.rpcURL}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    query: `query Safe($chainId: String!, $safeAddress: String!) {
                  safe(chainId: $chainId, safeAddress: $safeAddress) {
                    owners {
                      address
                    }
                  }
                }`,
                    variables: reqVar,
                }),
            });

            if (response.status === 200) {
                const result = await response.json();
                if (result.error) {
                    console.log(result.error);
                    throw new Error("GraphQL API Failed");
                }
                if (result.data.safe === null) console.log("no Data");
                const owners: { address: string }[] = result.data.safe.owners;
                const addresses = owners.map(element => element.address)
                return addresses
            }
        } catch (e) {
            console.log('error', e)
            throw new Error("error in getOwners")
        }
    }

    async isOwner(userAddress: string): Promise<boolean> {
        const owners = await this.getOwners()
        const userRawAddress = new TonWeb.Address(userAddress).toString(false)
        return owners.includes(userRawAddress)
    }

    async signToken(tonTransfer: any, wallet: any) {

        const orderCellBoc = tonTransfer.multiSigExecutionInfo.orderCellBoc;

        const [cell] = TonWeb.boc.Cell.fromBoc(orderCellBoc);

        const orderHash = TonWeb.utils.bytesToHex(await cell.hash());
        const signature = await wallet.send("ton_rawSign", {
            data: orderHash,
        });
        return signature
    }

    async genToken(recipient: string, amount: string, wallet: any): Promise<any> {
        const rawSafeAddr = this.toRawAddress(this.safeAddress);
        const nanoAmount = TonWeb.utils.toNano(amount).toString();
        const reqVar = {
            chainId: this.chainIdString,
            safeAddress: rawSafeAddr,
            recipient: recipient,
            amount: nanoAmount,
        };
        console.log(reqVar, 'lllllllll')
        const response = await fetch(`${this.rpcURL}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                query: `query TonTransfer($chainId: String!, $safeAddress: String!, $amount: String!, $recipient: String!) {
                    tonTransfer(chainId: $chainId, safeAddress: $safeAddress, amount: $amount, recipient: $recipient) {
                      safeAddress
                      chainId
                      transfer {
                        sender
                        recipient
                        direction
                        transferInfo {
                          native {
                            transferType
                            value
                          }
                        }
                      }
                      multiSigExecutionInfo {
                        orderCellBoc
                        queryId
                        expiredAt
                        confirmationsRequired
                        confirmationsSubmitted
                        confirmations
                        executor
                      }
                    }
                  }`,
                variables: reqVar,
            }),
        });

        if (response.status === 200) {
            const result = await response.json();
            if (result.error) {
                console.log(result.error);
                throw new Error("GraphQL API Failed");
            }

            const res = result.data;
            if (!res || !res.tonTransfer) {
                throw new Error("Error in genToken: couldn't generate token")
            }
            console.log(res, 'res')
            console.log("get payload successfully")

            const signature = await this.signToken(res.tonTransfer, wallet)

            console.log('signed successfully: ', signature)
            res.tonTransfer.multiSigExecutionInfo.confirmations[0] = signature;
            return res.tonTransfer
        }
        else {
            throw new Error("error in genToken: response status")
        }

    }

    async createTransaction(tonTransfer: any) {
        const reqVar = { content: tonTransfer };
        const queryId = tonTransfer.multiSigExecutionInfo.queryId;
        const response = await fetch(`${this.rpcURL}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                query: `mutation CreateTransfer($content: createTransferReq!) {
            createTransfer(content: $content) {
              success
              error {
                code
                detail
                extra
              }
            }
          }`,
                variables: reqVar,
            }),
        });
        if (response.status === 200) {
            const result = await response.json();
            if (result.error) {
                console.log(result.error);
                throw new Error("Error in createTransaction: GraphQL API Failed");
            }
        }
        return queryId
    }

    async proposeTransaction(recipient: string, amount: string, wallet: any): Promise<string | errorMessage> {
        const token = await this.genToken(recipient, amount, wallet)

        console.log('TON signed token: ', token)

        return await this.createTransaction(token)
    }

    async getSafeDetails(): Promise<SafeDetailsInterface> {
        const owners = await this.getOwners()
        if (!owners || owners.length == 0){
            throw new Error("couldn't load owners")
        }
        const balance = await this.getBalance()
        return {
            networkName: "TON",
            safeAddress: this.safeAddress,
            isDisabled: false,
            owners: owners,
            amount: balance,
            networkType: 3,
            networkId: -3,
            safeType: 'TonKey',
            safeIcon: '/safes_icons/realms.svg'
        }
    }

    async getTokenAndbalance(): Promise<{ value?: TokenDetailsInterface[]; error?: string; }> {
        let list: TokenDetailsInterface[] = []
        const balance = await this.getBalance()
        const tonUsdRate = 1.43
        list.push({
            tokenIcon: '/network_icons/solana.svg',
            tokenName: 'TON',
            tokenValueAmount: undefined,
            usdValueAmount: balance,
            mintAddress: undefined,
            info: undefined,
            fiatConversion: tonUsdRate,
            symbol: 'TON'
        })
        return { value: list }
    }

    async getBalance(): Promise<number> {
        const rawAddr = this.toRawAddress(this.safeAddress);
        const reqVar = {
            chainId: this.chainIdString,
            safeAddress: rawAddr,
        };

        const response = await fetch(`${this.rpcURL}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                query: `query Balance($chainId: String!, $safeAddress: String!) {
                      balance(chainId: $chainId, safeAddress: $safeAddress) {
                        fiatTotal
                    }}`,
                variables: reqVar,
            }),
        });
        if (response.status === 200) {
            const result = await response.json();
            if (result.error) {
                console.log(result.error);
                throw new Error("Error in getBalance: GraphQL API Failed");
            }
            if (result.data.safe === null) console.log("no Data");
            const balance = result.data.balance.fiatTotal;
            return balance
        }

    }

    getNextSteps(): string[] {
        return ['Open the transaction on TonKey', 'Sign the newly created proposal', 'Ask all the multi-sig signers to sign the proposal']
    }

    async proposeTransactions(grantName: string, initiateTransactionData: TransactionDataInterface[], wallet: '' | PhantomProvider): Promise<string | errorMessage> {
        return { error: 'use proposeTransaction insted' }
    }
}
