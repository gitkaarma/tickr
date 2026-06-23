import { useOverview } from '@/api/queries'
import { DeltaBadge } from '@/components/common/DeltaBadge'
import { ErrorState } from '@/components/common/ErrorState'
import { Skeleton } from '@/components/ui/skeleton'
import { formatPrice } from '@/lib/format'

export function MarketStrip() {
  const { data, isLoading, isError, refetch } = useOverview()

  if (isLoading) {
    return (
      <div className="flex gap-3 overflow-hidden">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-[4.5rem] min-w-[8.5rem] flex-1" />
        ))}
      </div>
    )
  }

  if (isError) {
    return <ErrorState title="Couldn't load markets" onRetry={() => refetch()} className="py-5" />
  }

  if (!data || data.length === 0) return null

  return (
    <div className="flex gap-3 overflow-x-auto pb-1">
      {data.map((t) => (
        <div
          key={t.symbol}
          className="flex min-w-[8.5rem] shrink-0 flex-col gap-1.5 rounded-xl border border-border bg-card px-3 py-2.5"
        >
          <span className="text-xs text-muted-foreground">{t.label}</span>
          <span className="font-mono text-sm font-semibold tabular-nums text-foreground">
            {formatPrice(t.price, t.currency)}
          </span>
          <DeltaBadge percent={t.changePercent} />
        </div>
      ))}
    </div>
  )
}
