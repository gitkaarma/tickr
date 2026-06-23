import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from './client'
import type {
  CompareResult,
  HeatmapCell,
  MarketTicker,
  Movers,
  NewsItem,
  PriceHistory,
  Quote,
  RangeCode,
  SymbolMatch,
  WatchlistEntry,
} from './types'

// --- fetchers ----------------------------------------------------------------

const get = async <T>(url: string, params?: Record<string, unknown>): Promise<T> =>
  (await api.get<T>(url, { params })).data

// --- search ------------------------------------------------------------------

export function useSearch(query: string) {
  const q = query.trim()
  return useQuery({
    queryKey: ['search', q.toLowerCase()],
    queryFn: () => get<SymbolMatch[]>('/api/search', { q }),
    enabled: q.length >= 1,
    staleTime: 60 * 60 * 1000,
  })
}

// --- single stock ------------------------------------------------------------

export function useQuote(symbol: string | undefined) {
  return useQuery({
    queryKey: ['quote', symbol],
    queryFn: () => get<Quote>(`/api/stocks/${symbol}/quote`),
    enabled: !!symbol,
    staleTime: 30 * 1000,
    refetchInterval: 60 * 1000,
  })
}

export function useHistory(symbol: string | undefined, range: RangeCode) {
  return useQuery({
    queryKey: ['history', symbol, range],
    queryFn: () => get<PriceHistory>(`/api/stocks/${symbol}/history`, { range }),
    enabled: !!symbol,
    staleTime: 5 * 60 * 1000,
  })
}

export function useNews(symbol: string | undefined) {
  return useQuery({
    queryKey: ['news', symbol],
    queryFn: () => get<NewsItem[]>(`/api/stocks/${symbol}/news`),
    enabled: !!symbol,
    staleTime: 10 * 60 * 1000,
  })
}

export function useCompare(symbols: string[], range: RangeCode) {
  return useQuery({
    queryKey: ['compare', symbols.join(','), range],
    queryFn: () => get<CompareResult>('/api/stocks/compare', { symbols: symbols.join(','), range }),
    enabled: symbols.length >= 2,
    staleTime: 5 * 60 * 1000,
  })
}

// --- markets -----------------------------------------------------------------

export function useOverview() {
  return useQuery({
    queryKey: ['markets', 'overview'],
    queryFn: () => get<MarketTicker[]>('/api/markets/overview'),
    staleTime: 30 * 1000,
    refetchInterval: 60 * 1000,
  })
}

export function useHeatmap() {
  return useQuery({
    queryKey: ['markets', 'heatmap'],
    queryFn: () => get<HeatmapCell[]>('/api/markets/heatmap'),
    staleTime: 30 * 1000,
    refetchInterval: 60 * 1000,
  })
}

export function useMovers() {
  return useQuery({
    queryKey: ['markets', 'movers'],
    queryFn: () => get<Movers>('/api/markets/movers'),
    staleTime: 30 * 1000,
    refetchInterval: 60 * 1000,
  })
}

export function useMarketNews() {
  return useQuery({
    queryKey: ['markets', 'news'],
    queryFn: () => get<NewsItem[]>('/api/markets/news'),
    staleTime: 10 * 60 * 1000,
  })
}

// --- watchlist ---------------------------------------------------------------

export function useWatchlist() {
  return useQuery({
    queryKey: ['watchlist'],
    queryFn: () => get<WatchlistEntry[]>('/api/watchlist'),
    staleTime: 30 * 1000,
  })
}

export function useAddToWatchlist() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (symbol: string) => api.post('/api/watchlist', { symbol }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['watchlist'] }),
  })
}

export function useRemoveFromWatchlist() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (symbol: string) => api.delete(`/api/watchlist/${symbol}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['watchlist'] }),
  })
}
