import { Star, Trash2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useRemoveFromWatchlist, useWatchlist } from '@/api/queries'
import { DeltaBadge } from '@/components/common/DeltaBadge'
import { EmptyState } from '@/components/common/EmptyState'
import { ErrorState } from '@/components/common/ErrorState'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { formatPrice } from '@/lib/format'

export function Watchlist() {
  const { data, isLoading, isError, refetch } = useWatchlist()
  const remove = useRemoveFromWatchlist()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Watchlist</h1>
        <p className="text-sm text-muted-foreground">Your saved symbols, with live quotes.</p>
      </div>

      {isLoading ? (
        <div className="space-y-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-14" />
          ))}
        </div>
      ) : isError ? (
        <ErrorState title="Couldn't load your watchlist" onRetry={() => refetch()} />
      ) : !data || data.length === 0 ? (
        <EmptyState
          icon={Star}
          title="Your watchlist is empty"
          message="Search for a symbol and add it to track it here."
          action={
            <Button asChild variant="outline" size="sm">
              <Link to="/">Browse markets</Link>
            </Button>
          }
        />
      ) : (
        <Card className="divide-y divide-border">
          {data.map((w) => (
            <div key={w.symbol} className="flex items-center gap-3 p-3">
              <Link to={`/stocks/${w.symbol}`} className="min-w-0 flex-1">
                <div className="text-sm font-semibold text-foreground">{w.symbol}</div>
                <div className="text-xs text-muted-foreground">
                  Added {new Date(w.addedAt).toLocaleDateString('en-US', { dateStyle: 'medium' })}
                </div>
              </Link>
              <span className="font-mono text-sm tabular-nums text-foreground">
                {w.price > 0 ? formatPrice(w.price) : '—'}
              </span>
              <DeltaBadge percent={w.changePercent} />
              <button
                type="button"
                onClick={() => remove.mutate(w.symbol)}
                disabled={remove.isPending}
                className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-secondary hover:text-down"
                aria-label={`Remove ${w.symbol}`}
              >
                <Trash2 className="size-4" />
              </button>
            </div>
          ))}
        </Card>
      )}
    </div>
  )
}
