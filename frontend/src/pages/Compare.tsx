import { GitCompareArrows, X } from 'lucide-react'
import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { apiErrorMessage } from '@/api/client'
import { useCompare } from '@/api/queries'
import type { RangeCode } from '@/api/types'
import { COMPARE_COLORS, CompareChart } from '@/components/charts/CompareChart'
import { EmptyState } from '@/components/common/EmptyState'
import { ErrorState } from '@/components/common/ErrorState'
import { RangeSelector } from '@/components/common/RangeSelector'
import { SymbolSearchInput } from '@/components/search/SymbolSearchInput'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { formatSignedPercent } from '@/lib/format'

const QUICK_PICKS: { label: string; symbols: string[] }[] = [
  { label: 'AAPL · MSFT · GOOGL', symbols: ['AAPL', 'MSFT', 'GOOGL'] },
  { label: 'NVDA · AMD · INTC', symbols: ['NVDA', 'AMD', 'INTC'] },
  { label: 'SPY · QQQ · DIA', symbols: ['SPY', 'QQQ', 'DIA'] },
]

export function Compare() {
  const [params, setParams] = useSearchParams()
  const initial = (params.get('symbols') ?? '')
    .split(',')
    .map((s) => s.trim().toUpperCase())
    .filter(Boolean)

  const [symbols, setSymbols] = useState<string[]>(initial)
  const [range, setRange] = useState<RangeCode>('1Y')
  const compareQ = useCompare(symbols, range)

  const sync = (next: string[]) => {
    const unique = Array.from(new Set(next.map((s) => s.toUpperCase()))).slice(0, 4)
    setSymbols(unique)
    setParams(unique.length ? { symbols: unique.join(',') } : {})
  }
  const addSymbol = (s: string) => {
    if (!symbols.includes(s.toUpperCase())) sync([...symbols, s])
  }

  // Final percent change per series, for the legend.
  const finals = compareQ.data?.series.map((s) => ({
    symbol: s.symbol,
    value: s.points.length ? s.points[s.points.length - 1].value : 0,
  }))

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Compare</h1>
        <p className="text-sm text-muted-foreground">
          Search and add 2 to 4 symbols to compare performance, normalized to percent change.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {symbols.map((s, i) => (
          <span
            key={s}
            className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card py-1 pl-2 pr-1 text-sm"
          >
            <span
              className="size-2 rounded-full"
              style={{ backgroundColor: COMPARE_COLORS[i % COMPARE_COLORS.length] }}
            />
            <span className="font-medium text-foreground">{s}</span>
            <button
              type="button"
              onClick={() => sync(symbols.filter((x) => x !== s))}
              className="rounded p-0.5 text-muted-foreground hover:text-foreground"
              aria-label={`Remove ${s}`}
            >
              <X className="size-3.5" />
            </button>
          </span>
        ))}
        {symbols.length < 4 && (
          <SymbolSearchInput
            onSelect={addSymbol}
            placeholder={symbols.length === 0 ? 'Search a symbol to compare…' : 'Add another…'}
          />
        )}
        <div className="ml-auto">
          <RangeSelector value={range} onChange={setRange} />
        </div>
      </div>

      {symbols.length < 2 ? (
        <EmptyState
          icon={GitCompareArrows}
          title="Compare up to four symbols"
          message="Search above to add symbols, or start with a popular set:"
          action={
            <div className="flex flex-wrap justify-center gap-2">
              {QUICK_PICKS.map((p) => (
                <Button key={p.label} variant="outline" size="sm" onClick={() => sync(p.symbols)}>
                  {p.label}
                </Button>
              ))}
            </div>
          }
        />
      ) : (
        <Card className="p-4">
          {finals && finals.length > 0 && (
            <div className="mb-3 flex flex-wrap gap-x-4 gap-y-1">
              {finals.map((f, i) => (
                <div key={f.symbol} className="flex items-center gap-1.5 text-sm">
                  <span
                    className="size-2.5 rounded-full"
                    style={{ backgroundColor: COMPARE_COLORS[i % COMPARE_COLORS.length] }}
                  />
                  <span className="font-medium text-foreground">{f.symbol}</span>
                  <span
                    className={`font-mono tabular-nums ${f.value >= 0 ? 'text-up' : 'text-down'}`}
                  >
                    {formatSignedPercent(f.value)}
                  </span>
                </div>
              ))}
            </div>
          )}
          {compareQ.isLoading ? (
            <Skeleton className="h-[360px] w-full" />
          ) : compareQ.isError ? (
            <ErrorState
              title="Couldn't build the comparison"
              message={apiErrorMessage(compareQ.error)}
              onRetry={() => compareQ.refetch()}
            />
          ) : compareQ.data ? (
            <CompareChart result={compareQ.data} />
          ) : null}
        </Card>
      )}
    </div>
  )
}
