import type { RangeCode } from '@/api/types'
import { cn } from '@/lib/utils'

const RANGES: RangeCode[] = ['1D', '1W', '1M', '3M', '6M', '1Y', '5Y']

export function RangeSelector({
  value,
  onChange,
}: {
  value: RangeCode
  onChange: (r: RangeCode) => void
}) {
  return (
    <div className="inline-flex items-center gap-0.5 rounded-lg border border-border bg-card p-0.5">
      {RANGES.map((r) => (
        <button
          key={r}
          type="button"
          onClick={() => onChange(r)}
          className={cn(
            'rounded-md px-2.5 py-1 text-xs font-medium tabular-nums transition-colors',
            value === r ? 'bg-secondary text-foreground' : 'text-muted-foreground hover:text-foreground',
          )}
        >
          {r}
        </button>
      ))}
    </div>
  )
}
