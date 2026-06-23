import { useNews } from '@/api/queries'
import { ErrorState } from '@/components/common/ErrorState'
import { NewsList, NewsSkeleton } from './NewsList'

export function NewsFeed({ symbol }: { symbol: string }) {
  const { data, isLoading, isError, refetch } = useNews(symbol)

  if (isLoading) return <NewsSkeleton />
  if (isError) return <ErrorState title="Couldn't load news" onRetry={() => refetch()} />

  return (
    <NewsList
      items={data ?? []}
      emptyMessage="There's no recent coverage for this symbol, or the news provider isn't configured."
    />
  )
}
