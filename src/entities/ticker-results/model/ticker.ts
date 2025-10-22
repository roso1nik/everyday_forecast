export interface Ticker {
    id: number
    name: string
    processCount: number
}

export interface ResultTicker {
    id: number
    tickersId: number
    timeframe: TickerTimeFrame
    direction: TickerDirection
    leverage: number | null
    stopLoss: number | null
    takeProfit: number | null
    currentPrice: number | null
    predictedPrice: number | null
    realPrice: number | null
    difference: number | null
    leverageDifference: number | null
    percentDifference: number | null
    isClosed: boolean
    closedAt: number | null
    createdAt: string
    ticker: Omit<Ticker, 'processCount'>
}

export enum TickerDirection {
    LONG = 'Long',
    SHORT = 'Short',
    NOTHING = 'Nothing'
}

export enum TickerTimeFrame {
    OneDay = 'OneDay',
    OneWeek = 'OneWeek '
}
