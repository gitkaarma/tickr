import { Search } from 'lucide-react'
import { useState } from 'react'
import { useSearch } from '@/api/queries'
import { Spinner } from '@/components/ui/spinner'
import { useDebounced } from '@/lib/useDebounced'

/** Inline symbol/company autocomplete. Calls onSelect with the chosen ticker. */
export function SymbolSearchInput({
  onSelect,
  placeholder = 'Search symbol or company…',
  disabled,
}: {
  onSelect: (symbol: string) => void
  placeholder?: string
  disabled?: boolean
}) {
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const debounced = useDebounced(query, 250)
  const { data: results, isFetching } = useSearch(debounced)

  const choose = (symbol: string) => {
    onSelect(symbol)
    setQuery('')
    setOpen(false)
  }

  return (
    <div className="relative w-full sm:w-64">
      <div className="flex h-9 items-center gap-2 rounded-lg border border-border bg-card px-2.5 focus-within:border-input">
        <Search className="size-4 shrink-0 text-muted-foreground" />
        <input
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setOpen(true)
          }}
          onFocus={() => setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 150)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && results && results.length > 0) {
              e.preventDefault()
              choose(results[0].symbol)
            }
            if (e.key === 'Escape') setOpen(false)
          }}
          placeholder={placeholder}
          disabled={disabled}
          className="h-full w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground disabled:opacity-50"
        />
        {isFetching && <Spinner className="shrink-0 text-muted-foreground" />}
      </div>
      {open && debounced.trim().length > 0 && (
        <div className="absolute z-20 mt-1 max-h-72 w-full overflow-y-auto rounded-lg border border-border bg-popover shadow-xl">
          {results && results.length > 0 ? (
            results.map((r) => (
              <button
                key={`${r.symbol}-${r.exchange ?? ''}`}
                type="button"
                onMouseDown={(e) => {
                  e.preventDefault()
                  choose(r.symbol)
                }}
                className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-secondary"
              >
                <span className="font-semibold text-foreground">{r.symbol}</span>
                <span className="min-w-0 flex-1 truncate text-muted-foreground">{r.name}</span>
                {r.exchange && <span className="shrink-0 text-xs text-muted-foreground">{r.exchange}</span>}
              </button>
            ))
          ) : (
            <div className="px-3 py-3 text-sm text-muted-foreground">
              {isFetching ? 'Searching…' : 'No matches'}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
