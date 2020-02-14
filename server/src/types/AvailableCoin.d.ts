export interface AvailableCoin {
    id: String,
    name: String,
    symbol: String,
    cmc_rank: number,
    quote: {
        USD: {
            price: number,
            volume_24h: number,
            market_cap: number,
        }
    }
}