import axios from "axios"

const getDateInDDMMYYYY = (date: Date) =>{
    return `${date.getDate()+1<10?"0":""}${date.getDate()}`+"-"+ `${date.getMonth()+1<10?"0":""}${date.getMonth()+1}`+"-"+ date.getFullYear()
}

const solanaToUsdOnDate = async(solAmount: number, date:any) => {
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

const solanaToUsd = async(solAmount: number) => {
    const url = 'https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd'
    const solToUsd = parseFloat((await axios.get(url)).data.solana.usd)
    return Math.floor(solToUsd * solAmount)
}

const solanaToUsdRate = async() => {
    const url = 'https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd'
    const solToUsd = parseFloat((await axios.get(url)).data.solana.usd)
    return solToUsd
}

const usdToSolana = async(usdAmount: number) => {
    const url = 'https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd'
    const usdToSolana = parseFloat((await axios.get(url)).data.solana.usd)
    return (usdAmount / usdToSolana)
}

const getCeloTokenUSDRate = async () => {
    const cachedData = localStorage.getItem('celoTokenUSDRate');
    const currentTime = Date.now();
    const oneMinute = 60 * 1000; // 1 minute in milliseconds

    if (cachedData) {
        const { data, timestamp } = JSON.parse(cachedData);
        if (currentTime - timestamp < oneMinute) {
            return data;
        }
    }

    try {
        const response = await axios.get(`https://api.coingecko.com/api/v3/simple/price?ids=celo-dollar%2Ccelo%2Ctether%2Ccelo-euro&vs_currencies=usd`);
        const dataToCache = { data: response.data, timestamp: currentTime };
        localStorage.setItem('celoTokenUSDRate', JSON.stringify(dataToCache));
        return response.data;
    } catch (e) {
        console.log('error', e);
        const fallbackData = { celo: { usd: 1 }, 'celo-dollar': { usd: 1 }, tether: { usd: 1 }, 'celo-euro': { usd: 1 } };
        localStorage.setItem('celoTokenUSDRate', JSON.stringify({ data: fallbackData, timestamp: currentTime }));
        return fallbackData;
    }
}


const getTokenUSDonDate = async (tokenName: string, date: string) => {
	let url = `https://api.coingecko.com/api/v3/simple/price?ids=${tokenName}&vs_currencies=usd`
	let tokenUsdValue = parseFloat((await axios.get(url)).data[tokenName].usd)
	
	return tokenUsdValue;
}

export { 
    getTokenUSDonDate,
    solanaToUsd, 
    solanaToUsdRate, 
    solanaToUsdOnDate, 
    usdToSolana, 
    getCeloTokenUSDRate, 
    getDateInDDMMYYYY
}