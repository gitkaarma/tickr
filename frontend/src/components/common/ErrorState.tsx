import { AlertTriangle, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface ErrorStateProps {
  title?: string
  message?: string
  onRetry?: () => void
  className?: string
}

/** A compact, inline error panel for a failed data section. */
export function ErrorState({ title = 'Unable to load', message, onRetry, className }: ErrorStateProps) {
  return (
    <div
      className={
        'flex flex-col items-center justify-center gap-3 rounded-xl border border-border bg-card p-8 text-center ' +
        (className ?? '')
      }
    >
      <AlertTriangle className="size-7 text-down" />
      <div>
        <p className="font-medium text-foreground">{title}</p>
        {message && <p className="mx-auto mt-1 max-w-sm text-sm text-muted-foreground">{message}</p>}
      </div>
      {onRetry && (
        <Button variant="outline" size="sm" onClick={onRetry}>
          <RefreshCw className="size-3.5" />
          Try again
        </Button>
      )}
    </div>
  )
}
