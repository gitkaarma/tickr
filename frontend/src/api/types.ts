// TypeScript mirrors of the backend DTOs.

export type RangeCode = '1D' | '1W' | '1M' | '3M' | '6M' | '1Y' | '5Y'

export interface SymbolMatch {
  symbol: string
  name: string | null
  exchange: string | null
  type: string | null
  currency: string | null
  country: string | null
}

export interface Quote {
  symbol: string
  name: string | null
  exchange: string | null
  currency: string | null
  price: number
  change: number
  changePercent: number
  open: number
  high: number
  low: number
  previousClose: number
  volume: number | null
  fiftyTwoWeekHigh: number | null
  fiftyTwoWeekLow: number | null
  marketCap: number | null
  peRatio: number | null
  logoUrl: string | null
  marketOpen: boolean
  asOf: string | null
}

export interface Candle {
  datetime: string
  open: number
  high: number
  low: number
  close: number
  volume: number | null
}

export interface PriceHistory {
  symbol: string
  range: string
  interval: string
  candles: Candle[]
}

export interface MarketTicker {
  symbol: string
  label: string
  price: number
  change: number
  changePercent: number
  currency: string
}

export interface HeatmapCell {
  symbol: string
  sector: string
  price: number
  changePercent: number
}

export interface MoverItem {
  symbol: string
  name: string
  price: number
  change: number
  changePercent: number
}

export interface Movers {
  gainers: MoverItem[]
  losers: MoverItem[]
}

export interface NewsItem {
  headline: string
  summary: string | null
  source: string | null
  url: string | null
  imageUrl: string | null
  datetime: number
  category: string | null
}

export interface NormalizedPoint {
  datetime: string
  value: number
}

export interface CompareSeries {
  symbol: string
  points: NormalizedPoint[]
}

export interface CompareResult {
  range: string
  series: CompareSeries[]
}

export interface WatchlistEntry {
  symbol: string
  name: string
  price: number
  change: number
  changePercent: number
  addedAt: string
}

export interface ApiErrorBody {
  error: string
  message: string
  retryable: boolean
}
