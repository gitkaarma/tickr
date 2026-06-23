import type { Quote } from '@/api/types'
import { formatCompact, formatNumber, formatPrice } from '@/lib/format'

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border bg-card px-3 py-2.5">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="mt-0.5 font-mono text-sm font-medium tabular-nums text-foreground">{value}</div>
    </div>
  )
}

export function StatGrid({ quote }: { quote: Quote }) {
  const c = quote.currency ?? 'USD'
  const range52 =
    quote.fiftyTwoWeekLow != null && quote.fiftyTwoWeekHigh != null
      ? `${formatPrice(quote.fiftyTwoWeekLow, c)} – ${formatPrice(quote.fiftyTwoWeekHigh, c)}`
      : '—'

  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
      <Stat label="Open" value={formatPrice(quote.open, c)} />
      <Stat label="High" value={formatPrice(quote.high, c)} />
      <Stat label="Low" value={formatPrice(quote.low, c)} />
      <Stat label="Prev Close" value={formatPrice(quote.previousClose, c)} />
      <Stat label="Volume" value={quote.volume != null ? formatNumber(quote.volume) : '—'} />
      <Stat label="Market Cap" value={formatCompact(quote.marketCap)} />
      <Stat label="P/E Ratio" value={quote.peRatio != null ? quote.peRatio.toFixed(2) : '—'} />
      <Stat label="52W Range" value={range52} />
    </div>
  )
}
