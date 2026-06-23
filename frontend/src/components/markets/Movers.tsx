import { TrendingDown, TrendingUp } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useMovers } from '@/api/queries'
import type { MoverItem } from '@/api/types'
import { DeltaBadge } from '@/components/common/DeltaBadge'
import { ErrorState } from '@/components/common/ErrorState'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { formatPrice } from '@/lib/format'

function MoverRow({ item }: { item: MoverItem }) {
  return (
    <Link
      to={`/stocks/${item.symbol}`}
      className="flex items-center gap-3 rounded-lg px-2 py-2 transition-colors hover:bg-secondary"
    >
      <div className="min-w-0 flex-1">
        <div className="text-sm font-semibold text-foreground">{item.symbol}</div>
        <div className="truncate text-xs text-muted-foreground">{item.name}</div>
      </div>
      <span className="font-mono text-sm tabular-nums text-foreground">{formatPrice(item.price)}</span>
      <DeltaBadge percent={item.changePercent} />
    </Link>
  )
}

function MoversCard({
  title,
  icon: Icon,
  iconClass,
  items,
}: {
  title: string
  icon: typeof TrendingUp
  iconClass: string
  items: MoverItem[]
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Icon className={`size-4 ${iconClass}`} />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-0.5">
        {items.length === 0 ? (
          <p className="px-2 py-4 text-sm text-muted-foreground">No data right now.</p>
        ) : (
          items.map((item) => <MoverRow key={item.symbol} item={item} />)
        )}
      </CardContent>
    </Card>
  )
}

export function Movers() {
  const { data, isLoading, isError, refetch } = useMovers()

  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2">
        {Array.from({ length: 2 }).map((_, i) => (
          <Skeleton key={i} className="h-72" />
        ))}
      </div>
    )
  }

  if (isError) {
    return <ErrorState title="Couldn't load movers" onRetry={() => refetch()} />
  }

  if (!data) return null

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <MoversCard title="Top Gainers" icon={TrendingUp} iconClass="text-up" items={data.gainers} />
      <MoversCard title="Top Losers" icon={TrendingDown} iconClass="text-down" items={data.losers} />
    </div>
  )
}
