import axios from "axios"

export const getDateInDDMMYYYY = (date: Date) =>{
    return `${date.getDate()+1<10?"0":""}${date.getDate()}`+"-"+ `${date.getMonth()+1<10?"0":""}${date.getMonth()+1}`+"-"+ date.getFullYear()
}

export const solanaToUsdOnDate = async(solAmount: number, date:any) => {
    if (!date) return 0
    let url = `https://api.coingecko.com/api/v3/coins/solana/history?date=${date}&localization=false`
    let solToUsd = parseFloat((await axios.get(url)).data?.market_data?.current_price?.usd)
    if(!solToUsd){
        const presentDate : any = new Date(new Date(date));
        const previousDay = new Date(presentDate - 864e5);
        const previousDate = getDateInDDMMYYYY(previousDay)
        url = `https://api.coingecko.com/api/v3/coins/solana/history?date=${previousDate}&localization=false`;
        solToUsd = parseFloat((await axios.get(url)).data?.market_data?.current_price?.usd)
            }
    return Math.floor((solToUsd) * solAmount) 
}

export const solanaToUsd = async(solAmount: number) => {
    const url = 'https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd'
    const solToUsd = parseFloat((await axios.get(url)).data.solana.usd)
    return Math.floor(solToUsd * solAmount)
}

export const usdToSolana = async(usdAmount: number) => {
    const url = 'https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd'
    const usdToSolana = parseFloat((await axios.get(url)).data.solana.usd)
    return (usdAmount / usdToSolana)
}