import { useHeatmap } from '@/api/queries'

/** A slim advancers-vs-decliners bar derived from the sector heatmap. */
export function MarketBreadth() {
  const { data } = useHeatmap()
  if (!data || data.length === 0) return null

  const up = data.filter((c) => c.changePercent > 0).length
  const down = data.filter((c) => c.changePercent < 0).length
  const total = data.length
  const upPct = (up / total) * 100

  return (
    <div className="flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-3">
      <span className="whitespace-nowrap text-xs text-muted-foreground">Sector breadth</span>
      <div className="flex h-2 flex-1 overflow-hidden rounded-full bg-secondary">
        <div className="bg-up" style={{ width: `${upPct}%` }} />
        <div className="bg-down" style={{ width: `${100 - upPct}%` }} />
      </div>
      <span className="whitespace-nowrap text-xs tabular-nums">
        <span className="text-up">{up} up</span>
        <span className="text-muted-foreground"> · </span>
        <span className="text-down">{down} down</span>
      </span>
    </div>
  )
}
