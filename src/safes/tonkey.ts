import TonWeb from 'tonweb';
import { SafeDetailsInterface, SafeInterface, TokenDetailsInterface, errorMessage } from '../types/Safe';
import { getTokenUSDonDate } from '../utils/tokenConversionUtils';
export const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export class tonkey implements SafeInterface {
    chainIdString: string
    chainId: number;
    rpcURL: string
    safeAddress: string
    provider: any
    tonDecimals: number = 9
    TONTokenId: string = 'the-open-network'

    constructor(chainId: number, rpcURL: string, safeAddress: string) {
        this.chainId = chainId
        this.chainIdString = chainId.toString()
        this.rpcURL = rpcURL
        this.safeAddress = safeAddress
    }

    toRawAddress(address: string): string {
        console.log('new version is here')
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
        if (!userAddress || userAddress === '') {
            throw new Error("address is empty")
        }
        const owners = await this.getOwners()
        const userRawAddress = new TonWeb.Address(userAddress).toString(false)
        return owners.includes(userRawAddress)
    }

    async signToken(tonTransfer: any, wallet: any) {

        const orderCellBoc = tonTransfer.multiSigExecutionInfo.orderCellBoc;

        const [cell] = TonWeb.boc.Cell.fromBoc(orderCellBoc);

        const orderHash = TonWeb.utils.bytesToHex(await cell.hash());
        try {
            const signature = await wallet.send("ton_rawSign", {
                data: orderHash,
            });
            return signature
        } catch (e) {
            console.log("Error in signToken", e)
            throw new Error("Error in signToken")
        }
    }
    async getOwnerIndex(userAddress: string): Promise<number> {
        const owners = await this.getOwners()
        const userRawAddress = new TonWeb.Address(userAddress).toString(false)
        const ownerIndex = owners.indexOf(userRawAddress)
        return ownerIndex
    }

    async genToken(recipient: string, amount: string, wallet: any, ownerIndex: number, remark: string): Promise<any> {
        console.log('started generating token')
        const rawSafeAddr = (this.toRawAddress(this.safeAddress))

        const nanoAmount = TonWeb.utils.toNano(amount).toString()

        const currentTime = (new Date()).toLocaleDateString().split('/').join('-')
        const TONTokenId = 'the-open-network'
        const tonUsdRate = await getTokenUSDonDate(TONTokenId, currentTime)

        const amountInTon = (parseFloat(nanoAmount) / tonUsdRate).toFixed(0)

        if (!amountInTon) {
            throw new Error("cannot calculate the amount")
        }
        const reqVar = {
            chainId: this.chainIdString,
            safeAddress: rawSafeAddr,
            recipient: recipient,
            amount: amountInTon,
            remark
        };
        const response = await fetch(`${this.rpcURL}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                query: `query TonTransfer($recipient: String!, $amount: String!, $safeAddress: String!, $chainId: String!, $remark: String) {
                    tonTransfer(recipient: $recipient, amount: $amount, safeAddress: $safeAddress, chainId: $chainId, remark: $remark) {
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
                        remark
                      }
                    }
                  }`,
                variables: reqVar,
            }),
        });

        if (response.status === 200) {
            const result = await response.json();
            if (result.error) {
                console.log('Error in genToken: ', result.error);
                throw new Error("GraphQL API Failed");
            }

            const res = result.data;
            if (!res || !res.tonTransfer) {
                console.log("Error in genToken: couldn't generate token")
                throw new Error('cannot generate token')
            }
            console.log(res, 'res')
            console.log("get payload successfully")

            const signature = await this.signToken(res.tonTransfer, wallet)

            console.log('signed successfully: ', signature)
            res.tonTransfer.multiSigExecutionInfo.confirmations[ownerIndex] = signature;
            return res.tonTransfer
        }
        else {
            throw new Error("Error in genToken: response status")
        }

    }

    async createTransaction(tonTransfer: any) {

        console.log('Hasan and ali', tonTransfer.transfer.transferInfo.native.value)
        const reqVar = { content: tonTransfer, remark: '' }
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
            if (result.errors) {
                console.log('Error in createTransaction: ', result.errors);
                throw new Error("Error in createTransaction: GraphQL API Failed");
            }
        }
        else {
            throw new Error('Error in createTransaction response status')
        }
        return queryId
    }

    async proposeTransaction(recipient: string, amount: number, wallet: any, remark: string): Promise<string | errorMessage> {

        const accounts = await wallet.send('ton_requestAccounts')

        const account = accounts[0]
        const ownerIndex = await this.getOwnerIndex(account)

        if (ownerIndex === -1) {
            throw new Error('Selected account is not an owner')
        }

        const token = await this.genToken(recipient, amount.toString(), wallet, ownerIndex, remark)

        console.log('TON signed token: ', token)

        return await this.createTransaction(token)

    }

    async getSafeDetails(): Promise<SafeDetailsInterface> {
        const owners = await this.getOwners()
        if (!owners || owners.length == 0) {
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
            networkId: this.chainId,
            safeType: 'TonKey',
            safeIcon: '/icons/tonkey.svg'
        }
    }

    async getTokenAndbalance(): Promise<{ value?: TokenDetailsInterface[]; error?: string; }> {
        let list: TokenDetailsInterface[] = []
        const balance = await this.getBalance()

        const currentTime = (new Date()).toLocaleDateString().split('/').join('-')

        const tonUsdRate = await getTokenUSDonDate(this.TONTokenId, currentTime)
        list.push({
            tokenIcon: '/v2/icons/toncoin.svg',
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
            const balance = Number(result.data.balance.fiatTotal);

            return balance
        }

    }

    getNextSteps(): string[] {
        return ['Open the transaction on TonKey', 'Sign the newly created proposal', 'Ask all the multi-sig signers to sign the proposal']
    }

    async proposeTransactions(grantName: string, transactions: any[], wallet: any): Promise<string | errorMessage> {
        if (transactions.length === 0) {
            throw new Error('no transaction to propose')
        }
        else if (transactions.length > 1) {
            throw new Error('you cannot propose more than one builder/one milestone per transaction')
        }
        return await this.proposeTransaction(transactions[0].to, transactions[0].amount, wallet, grantName)
    }
}
