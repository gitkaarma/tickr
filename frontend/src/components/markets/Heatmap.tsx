import type { CSSProperties } from 'react'
import { Link } from 'react-router-dom'
import { useHeatmap } from '@/api/queries'
import { ErrorState } from '@/components/common/ErrorState'
import { Skeleton } from '@/components/ui/skeleton'
import { formatSignedPercent } from '@/lib/format'

/** Background tint: green/red, deepening with the size of the move (saturating near +/-3%). */
function tileStyle(changePercent: number): CSSProperties {
  const intensity = Math.min(Math.abs(changePercent) / 3, 1)
  const rgb = changePercent >= 0 ? '22, 199, 132' : '234, 57, 67'
  return { backgroundColor: `rgba(${rgb}, ${0.1 + intensity * 0.5})` }
}

export function Heatmap() {
  const { data, isLoading, isError, refetch } = useHeatmap()

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 11 }).map((_, i) => (
          <Skeleton key={i} className="h-20" />
        ))}
      </div>
    )
  }

  if (isError) {
    return <ErrorState title="Couldn't load the heatmap" onRetry={() => refetch()} />
  }

  if (!data || data.length === 0) return null

  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
      {data.map((cell) => (
        <Link
          key={cell.symbol}
          to={`/stocks/${cell.symbol}`}
          style={tileStyle(cell.changePercent)}
          className="flex flex-col justify-between rounded-xl border border-white/5 p-3 transition-transform hover:scale-[1.02]"
        >
          <div className="flex items-baseline justify-between gap-2">
            <span className="truncate text-sm font-semibold text-foreground">{cell.sector}</span>
            <span className="text-xs text-foreground/70">{cell.symbol}</span>
          </div>
          <span className="mt-2 font-mono text-lg font-semibold tabular-nums text-foreground">
            {formatSignedPercent(cell.changePercent)}
          </span>
        </Link>
      ))}
    </div>
  )
}
