import { ethers, logger } from "ethers"
import { erc20ABI } from "wagmi"
import { getCeloTokenUSDRate } from "./tokenConversionUtils"


export const encodeTransactionData = (recipientAddress: string, fundAmount: string, rewardAssetDecimals: number) =>  {
    const ERC20Interface = new ethers.utils.Interface(erc20ABI)
    const txData = ERC20Interface.encodeFunctionData('transfer', [
        recipientAddress,
        ethers.utils.parseUnits(fundAmount, rewardAssetDecimals)
    ])

    return txData
}

export const createEVMMetaTransactions = async (workspaceSafeChainId: string , gnosisBatchData: any): Promise<any[]> => {

		const celoTokensUSDRateMapping = await (await getCeloTokenUSDRate()).data;
		const readyTxs = gnosisBatchData.map((data: any) => {
			let tokenUSDRate: number
			if(workspaceSafeChainId === '42220') {
				const tokenSelected = data.selectedToken.name.toLowerCase()
				if(tokenSelected === 'cusd') {
					tokenUSDRate = celoTokensUSDRateMapping['celo-dollar'].usd
				} else if(tokenSelected === 'ceuro') {
					tokenUSDRate = celoTokensUSDRateMapping['celo-euro'].usd
				} else if(tokenSelected === 'tether') {
					tokenUSDRate = celoTokensUSDRateMapping['tether'].usd
				} else if(tokenSelected === 'spcusd') {
					tokenUSDRate = 0
				} else if(tokenSelected === 'spCELO') {
					tokenUSDRate = 0
				}
			} else {
				tokenUSDRate = data.selectedToken.fiatConversion
			}

			const rewardAssetDecimals = data.selectedToken.info.decimals
			const rewardAssetAddress = data.selectedToken.info.tokenAddress
			const usdToToken = (data.amount / tokenUSDRate!).toFixed(rewardAssetDecimals)

			// console.log('reward asset address', rewardAssetAddress)
			logger.info('usd amount, usd rate, usd to token amount', data.amount, tokenUSDRate!, usdToToken)
			const txData = encodeTransactionData(data.to, (usdToToken.toString()), rewardAssetDecimals)
			const tx = {
				to: ethers.utils.getAddress(rewardAssetAddress),
				data: txData,
				value: '0'
			}
			return tx
		})

		return readyTxs
	}