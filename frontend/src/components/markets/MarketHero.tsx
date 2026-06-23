import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useHistory } from '@/api/queries'
import type { RangeCode } from '@/api/types'
import { AreaPriceChart } from '@/components/charts/AreaPriceChart'
import { DeltaBadge } from '@/components/common/DeltaBadge'
import { ErrorState } from '@/components/common/ErrorState'
import { RangeSelector } from '@/components/common/RangeSelector'
import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { formatPrice } from '@/lib/format'

/** Featured S&P 500 chart for the top of the home page (tracked via the SPY ETF). */
export function MarketHero() {
  const [range, setRange] = useState<RangeCode>('1M')
  const { data, isLoading, isError, refetch } = useHistory('SPY', range)

  const candles = data?.candles
  const last = candles && candles.length > 0 ? candles[candles.length - 1].close : null
  const first = candles && candles.length > 0 ? candles[0].close : null
  const pct = first && last ? (last / first - 1) * 100 : null

  return (
    <Card className="p-4 sm:p-5">
      <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Link to="/stocks/SPY" className="text-base font-semibold text-foreground hover:text-primary">
              S&amp;P 500
            </Link>
            <span className="rounded border border-border px-1.5 py-0.5 text-xs text-muted-foreground">
              SPY
            </span>
          </div>
          {last != null && (
            <div className="mt-1 flex flex-wrap items-center gap-2">
              <span className="font-mono text-2xl font-bold tabular-nums text-foreground">
                {formatPrice(last)}
              </span>
              {pct != null && <DeltaBadge percent={pct} />}
              {pct != null && <span className="text-xs text-muted-foreground">over {range}</span>}
            </div>
          )}
        </div>
        <div className="overflow-x-auto">
          <RangeSelector value={range} onChange={setRange} />
        </div>
      </div>

      {isLoading ? (
        <Skeleton className="h-[280px] w-full" />
      ) : isError ? (
        <ErrorState title="Couldn't load the chart" onRetry={() => refetch()} />
      ) : candles && candles.length > 0 ? (
        <AreaPriceChart candles={candles} height={280} />
      ) : (
        <div className="flex h-[280px] items-center justify-center text-sm text-muted-foreground">
          No chart data available.
        </div>
      )}
    </Card>
  )
}
