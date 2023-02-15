import { ethers, logger } from "ethers"
import { erc20ABI } from "wagmi"
import { getCeloTokenUSDRate } from "./tokenConversionUtils"


export const encodeTransactionData = (recipientAddress: string, fundAmount: string, rewardAssetDecimals: number, workspaceId: number, grantAddress: string, applicationId: number) =>  {
	console.log('params for encodeTransactionData' ,workspaceId, applicationId, fundAmount, rewardAssetDecimals)
    const ERC20Interface = new ethers.utils.Interface(erc20ABI)
   let txData = ERC20Interface.encodeFunctionData('transfer', [
        recipientAddress,
        ethers.utils.parseUnits(fundAmount, rewardAssetDecimals)
    ])

	txData = txData + ethers.utils.hexZeroPad(ethers.utils.hexlify(workspaceId), 32).slice(2) + ethers.utils.hexZeroPad(ethers.utils.hexlify(grantAddress), 32).slice(2) + ethers.utils.hexZeroPad(ethers.utils.hexlify(applicationId), 32).slice(2) + ethers.utils.hexZeroPad(ethers.utils.hexlify('0x5175657374626f6f6b'), 32).slice(2)

    return txData
}

export const createEVMMetaTransactions = async (workspaceId: string, grantAddress: string, workspaceSafeChainId: string , gnosisBatchData: any): Promise<any[]> => {
		const celoTokensUSDRateMapping = await (await getCeloTokenUSDRate()).data;
		const readyTxs = gnosisBatchData.map((data: any) => {
			let tokenUSDRate: number = 1
			if(workspaceSafeChainId === '42220') {
				const tokenSelected = data.selectedToken?.tokenName?.toLowerCase()
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
				tokenUSDRate = data.selectedToken.info.fiatConversion > 0 ? data.selectedToken.info.fiatConversion : 1
			}

			const rewardAssetDecimals = data.selectedToken.info.decimals
			const rewardAssetAddress = data.selectedToken.info.tokenAddress
			const usdToToken = (data.amount / tokenUSDRate).toFixed(rewardAssetDecimals)

			console.log(workspaceId, 'Received workspace ID in string')
			const txData = encodeTransactionData(data.to, (usdToToken.toString()), rewardAssetDecimals, parseInt(workspaceId, 16), grantAddress, data.applicationId)
			const tx = {
				to: ethers.utils.getAddress(rewardAssetAddress),
				data: txData,
				value: '0'
			}
			return tx
		})

		return readyTxs
	}