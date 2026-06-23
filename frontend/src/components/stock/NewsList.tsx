import { ExternalLink, Newspaper } from 'lucide-react'
import type { NewsItem } from '@/api/types'
import { EmptyState } from '@/components/common/EmptyState'
import { Skeleton } from '@/components/ui/skeleton'
import { formatRelative } from '@/lib/format'

export function NewsSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid gap-2 sm:grid-cols-2">
      {Array.from({ length: count }).map((_, i) => (
        <Skeleton key={i} className="h-[4.5rem]" />
      ))}
    </div>
  )
}

/** Many wire-service headlines end with " - Reuters"; drop it since we show the source as a chip. */
function cleanHeadline(headline: string, source: string | null): string {
  if (source && headline.endsWith(` - ${source}`)) {
    return headline.slice(0, headline.length - source.length - 3).trim()
  }
  return headline
}

/** Clean, text-forward news grid (no thumbnails — the free feed's images are generic placeholders). */
export function NewsList({ items, emptyMessage }: { items: NewsItem[]; emptyMessage?: string }) {
  if (items.length === 0) {
    return (
      <EmptyState
        icon={Newspaper}
        title="No recent news"
        message={emptyMessage ?? 'There is nothing to show right now.'}
      />
    )
  }
  return (
    <div className="grid gap-2 sm:grid-cols-2">
      {items.map((n, i) => (
        <a
          key={i}
          href={n.url ?? '#'}
          target="_blank"
          rel="noreferrer"
          className="group flex flex-col gap-2.5 rounded-xl border border-border bg-card p-3.5 transition-colors hover:border-primary/40"
        >
          <p className="line-clamp-2 text-sm font-medium leading-snug text-foreground">
            {cleanHeadline(n.headline, n.source)}
          </p>
          <div className="mt-auto flex items-center gap-2 text-xs text-muted-foreground">
            {n.source && (
              <span className="rounded bg-secondary px-1.5 py-0.5 font-medium text-foreground/80">
                {n.source}
              </span>
            )}
            <span className="whitespace-nowrap">{formatRelative(n.datetime)}</span>
            <ExternalLink className="ml-auto size-3 shrink-0 opacity-0 transition-opacity group-hover:opacity-60" />
          </div>
        </a>
      ))}
    </div>
  )
}
