import TonWeb from 'tonweb'
import { sleep } from '../utils/general'

export class TonWallet {

    name: string = 'TON Wallet'
    logo: string = '/wallet_icons/ton.svg'
    token: string = 'TON'
	provider: any
	tonReady: boolean = false
	address: string = ''

	constructor() {
		this.provider = null
		this.tonReady = false
	}

	checkTonReady(window: any) {
		if(window.ton) {
			this.provider = window.ton
			this.tonReady = true
			console.log('TON ready')

			this.provider.on('accountsChanged', (accounts) => {
				console.log('TON accountsChanged', accounts)
				const account = accounts[0]
				this.address = account
			})
		}
	}

	connect = async() => {
		const accounts = await this.provider.send('ton_requestAccounts')
		console.log('TON accountsChanged', accounts)
		const account = accounts[0]
		this.address = account

        const tonWeb = new TonWeb()
		const wallet = tonWeb.wallet.create({ address: this.address })
		const seqno = await wallet.methods.seqno().call()
		console.log('TON seqno', seqno)

        await sleep(1000)
        
		const transactions = await tonWeb.getTransactions(account, 20, undefined, undefined, undefined)
		console.log('TON transactions', transactions)

		console.log(await this.provider.send('ton_requestWallets'))
	}

	sendMoney = async(toAddress: string, amount: number) => {
		try {
			await this.connect()
			if(this.tonReady) {
				const result = await this.provider.send(
					'ton_sendTransaction',
					[{
						to: toAddress,
						value: amount * 10 ^ 8,
						data: 'dapp test',
						dataType: 'text'
					}]
				)
				console.log('result', result)
				return result
			}
		} catch(error) {
			// User denied or Error
			console.log(error)
		}
	}
}
