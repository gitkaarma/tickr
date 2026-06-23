import { ArrowLeft } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { apiErrorMessage } from '@/api/client'
import { useHistory, useQuote } from '@/api/queries'
import type { Quote, RangeCode } from '@/api/types'
import { AreaPriceChart } from '@/components/charts/AreaPriceChart'
import { DeltaBadge } from '@/components/common/DeltaBadge'
import { ErrorState } from '@/components/common/ErrorState'
import { RangeSelector } from '@/components/common/RangeSelector'
import { Section } from '@/components/common/Section'
import { NewsFeed } from '@/components/stock/NewsFeed'
import { StatGrid } from '@/components/stock/StatGrid'
import { WatchlistButton } from '@/components/stock/WatchlistButton'
import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { direction, formatPrice, formatSigned } from '@/lib/format'
import { cn } from '@/lib/utils'

function PriceHeader({ quote, sym }: { quote: Quote; sym: string }) {
  const dir = direction(quote.change)
  const color = dir === 'up' ? 'text-up' : dir === 'down' ? 'text-down' : 'text-foreground'
  const currency = quote.currency ?? 'USD'
  return (
    <div className="flex flex-wrap items-start justify-between gap-4">
      <div className="flex items-center gap-3">
        {quote.logoUrl && (
          <img src={quote.logoUrl} alt="" className="size-10 rounded-lg bg-white object-contain p-1" />
        )}
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">{sym}</h1>
            {quote.exchange && (
              <span className="rounded border border-border px-1.5 py-0.5 text-xs text-muted-foreground">
                {quote.exchange}
              </span>
            )}
          </div>
          {quote.name && <p className="text-sm text-muted-foreground">{quote.name}</p>}
        </div>
      </div>
      <div className="flex flex-col items-end gap-1">
        <div className="flex items-center gap-3">
          <span className={cn('font-mono text-3xl font-bold tabular-nums', color)}>
            {formatPrice(quote.price, currency)}
          </span>
          <WatchlistButton symbol={sym} />
        </div>
        <div className="flex items-center gap-2 text-sm">
          <span className={cn('font-mono tabular-nums', color)}>{formatSigned(quote.change, currency)}</span>
          <DeltaBadge percent={quote.changePercent} />
        </div>
      </div>
    </div>
  )
}

export function StockDetail() {
  const { symbol = '' } = useParams()
  const sym = symbol.toUpperCase()
  const [range, setRange] = useState<RangeCode>('1M')
  const quoteQ = useQuote(sym)
  const historyQ = useHistory(sym, range)

  // Performance over the currently selected range (first vs last close of the series).
  const rangeChange = useMemo(() => {
    const candles = historyQ.data?.candles
    if (!candles || candles.length < 2) return null
    const first = candles[0].close
    const last = candles[candles.length - 1].close
    if (!first) return null
    return { pct: (last / first - 1) * 100, abs: last - first }
  }, [historyQ.data])

  return (
    <div className="space-y-6">
      <Link
        to="/"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" /> Markets
      </Link>

      {quoteQ.isLoading ? (
        <div className="space-y-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-10 w-40" />
        </div>
      ) : quoteQ.isError ? (
        <ErrorState
          title={`Couldn't load ${sym}`}
          message={apiErrorMessage(quoteQ.error)}
          onRetry={() => quoteQ.refetch()}
        />
      ) : quoteQ.data ? (
        <PriceHeader quote={quoteQ.data} sym={sym} />
      ) : null}

      <Card className="p-4">
        <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-muted-foreground">Price history</span>
            {rangeChange && (
              <span className="flex items-center gap-1.5">
                <DeltaBadge percent={rangeChange.pct} />
                <span className="text-xs text-muted-foreground">over {range}</span>
              </span>
            )}
          </div>
          <div className="overflow-x-auto">
            <RangeSelector value={range} onChange={setRange} />
          </div>
        </div>
        {historyQ.isLoading ? (
          <Skeleton className="h-[320px] w-full" />
        ) : historyQ.isError ? (
          <ErrorState
            title="Couldn't load chart"
            message={apiErrorMessage(historyQ.error)}
            onRetry={() => historyQ.refetch()}
          />
        ) : historyQ.data && historyQ.data.candles.length > 0 ? (
          <AreaPriceChart candles={historyQ.data.candles} currency={quoteQ.data?.currency ?? 'USD'} />
        ) : (
          <div className="flex h-[320px] items-center justify-center text-sm text-muted-foreground">
            No chart data available.
          </div>
        )}
      </Card>

      {quoteQ.data && (
        <Section title="Key statistics">
          <StatGrid quote={quoteQ.data} />
        </Section>
      )}

      <Section title="Recent news">
        <NewsFeed symbol={sym} />
      </Section>
    </div>
  )
}
