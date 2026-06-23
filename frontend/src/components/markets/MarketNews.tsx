import { useMarketNews } from '@/api/queries'
import { ErrorState } from '@/components/common/ErrorState'
import { NewsList, NewsSkeleton } from '@/components/stock/NewsList'

export function MarketNews() {
  const { data, isLoading, isError, refetch } = useMarketNews()

  if (isLoading) return <NewsSkeleton />
  if (isError) return <ErrorState title="Couldn't load market news" onRetry={() => refetch()} />

  return <NewsList items={(data ?? []).slice(0, 6)} emptyMessage="No market news right now." />
}
