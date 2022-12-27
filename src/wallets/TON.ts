import TonWeb from 'tonweb'
import { sleep } from '../utils/general'

export class TonWallet {

    name: string = 'TON Wallet'
    logo: string = '/wallet_icons/ton.svg'
    token: string = 'TON'
	provider: any
	tonReady: boolean = false
	address: string = ''
    tonWeb: TonWeb

	constructor() {
		this.provider = null
		this.tonReady = false
        this.tonWeb = new TonWeb()
	}

	checkTonReady = async(window: any) => {
		if(window.ton) {
			this.provider = window.ton
			this.tonReady = true
			console.log('TON ready')

			this.provider.on('accountsChanged', (accounts) => {
				console.log('TON accountsChanged', accounts)
				const account = accounts[0]
				this.address = account
			})
			await sleep(1000)
		}
	}

	connect = async() => {
		const accounts = await this.provider.send('ton_requestAccounts')
		const account = accounts[0]
		this.address = account
	}

	sendMoney = async(toAddress: string, amount: number, callback: any) => {
		try {
			await this.connect()
			await sleep(1000)
			if(this.tonReady) {
                const wallet = this.tonWeb.wallet.create({ address: this.address })
				const prevSeqno = await wallet.methods.seqno().call()
				console.log('TON seqno', prevSeqno)
				await sleep(1000)

				const result = await this.provider.send(
					'ton_sendTransaction',
					[{
						to: toAddress,
						value: TonWeb.utils.toNano(amount.toString()).toNumber(),
						data: 'questbook TON payout',
						dataType: 'text'
					}]
				)

				if(result){
					await sleep(1000)
					let startTime = new Date().getTime();
					let interval = setInterval(async() => {
						console.log('TON interval called');
						if(new Date().getTime() - startTime > 30000){
							clearInterval(interval);
							callback({error: 'Transaction timeout'})
						}
	
						const seqno = await wallet.methods.seqno().call()
						console.log('TON seqno', seqno)
						if(seqno > prevSeqno) {
							await sleep(1000)
							const transactions = await this.tonWeb.getTransactions(this.address, 5, undefined, undefined, undefined)
							console.log('TON transactions after transaction', transactions)
							let transactionHash = ''
							for(let i = 0; i < transactions.length; i++){
								if(transactions[i]?.in_msg?.message === "questbook TON payout"){
									transactionHash = transactions[i].transaction_id.hash
									break
								}
							}
							console.log({transactionHash})
							clearInterval(interval);
							callback({transactionHash})
						}
					}, 1000)
				}else{
					callback({error: 'Transaction failed'})
				}
			}else{
				callback({error: 'TON not ready'})
			}
		} catch(error) {
			console.log(error)
			callback({error: error.message})
		}
	}
}
