import * as Dialog from '@radix-ui/react-dialog'
import { Command } from 'cmdk'
import { Search, TrendingUp } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSearch } from '@/api/queries'
import { Spinner } from '@/components/ui/spinner'
import { useDebounced } from '@/lib/useDebounced'

/** Header search: a command palette (also opens with Cmd/Ctrl-K) that navigates to a symbol. */
export function SearchCommand() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const debounced = useDebounced(query, 250)
  const { data: results, isFetching } = useSearch(debounced)
  const navigate = useNavigate()

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setOpen((o) => !o)
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [])

  const select = (symbol: string) => {
    setOpen(false)
    setQuery('')
    navigate(`/stocks/${symbol}`)
  }

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <button className="flex h-9 w-full items-center gap-2 rounded-lg border border-border bg-card px-3 text-sm text-muted-foreground transition-colors hover:border-input sm:w-64">
          <Search className="size-4" />
          <span className="flex-1 text-left">Search symbol…</span>
          <kbd className="hidden rounded border border-border px-1.5 py-0.5 text-[10px] sm:inline">⌘K</kbd>
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm" />
        <Dialog.Content
          aria-describedby={undefined}
          className="fixed left-1/2 top-[14%] z-50 w-[92vw] max-w-xl -translate-x-1/2 overflow-hidden rounded-xl border border-border bg-popover shadow-2xl"
        >
          <Dialog.Title className="sr-only">Search symbols</Dialog.Title>
          <Command shouldFilter={false} className="text-popover-foreground">
            <div className="flex items-center gap-2 border-b border-border px-3">
              <Search className="size-4 shrink-0 text-muted-foreground" />
              <Command.Input
                value={query}
                onValueChange={setQuery}
                autoFocus
                placeholder="Search stocks and ETFs (e.g. AAPL, Microsoft)…"
                className="h-12 w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
              />
              {isFetching && <Spinner className="shrink-0 text-muted-foreground" />}
            </div>
            <Command.List className="max-h-80 overflow-y-auto p-1">
              {debounced.length === 0 ? (
                <div className="py-8 text-center text-sm text-muted-foreground">
                  Start typing to search…
                </div>
              ) : (
                <>
                  <Command.Empty className="py-8 text-center text-sm text-muted-foreground">
                    {isFetching ? 'Searching…' : 'No matches found.'}
                  </Command.Empty>
                  {results?.map((r) => (
                    <Command.Item
                      key={`${r.symbol}-${r.exchange ?? ''}`}
                      value={`${r.symbol} ${r.name ?? ''}`}
                      onSelect={() => select(r.symbol)}
                      className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-sm aria-selected:bg-secondary"
                    >
                      <TrendingUp className="size-4 shrink-0 text-primary" />
                      <span className="font-semibold text-foreground">{r.symbol}</span>
                      <span className="flex-1 truncate text-muted-foreground">{r.name}</span>
                      {r.exchange && (
                        <span className="shrink-0 text-xs text-muted-foreground">{r.exchange}</span>
                      )}
                    </Command.Item>
                  ))}
                </>
              )}
            </Command.List>
          </Command>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
