import { Star } from 'lucide-react'
import { useAddToWatchlist, useRemoveFromWatchlist, useWatchlist } from '@/api/queries'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export function WatchlistButton({ symbol }: { symbol: string }) {
  const sym = symbol.toUpperCase()
  const { data: list } = useWatchlist()
  const add = useAddToWatchlist()
  const remove = useRemoveFromWatchlist()
  const inList = list?.some((w) => w.symbol === sym) ?? false
  const busy = add.isPending || remove.isPending

  return (
    <Button
      variant={inList ? 'secondary' : 'default'}
      size="sm"
      disabled={busy}
      onClick={() => (inList ? remove.mutate(sym) : add.mutate(sym))}
    >
      <Star className={cn('size-4', inList && 'fill-current')} />
      {inList ? 'In watchlist' : 'Add to watchlist'}
    </Button>
  )
}
