import { ArrowDown, ArrowUp } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { direction, formatSignedPercent } from '@/lib/format'

/** A colored pill showing a percent move with a direction arrow. */
export function DeltaBadge({ percent, className }: { percent: number; className?: string }) {
  const dir = direction(percent)
  const Icon = dir === 'up' ? ArrowUp : dir === 'down' ? ArrowDown : null
  return (
    <Badge variant={dir} className={className}>
      {Icon && <Icon className="size-3" />}
      {formatSignedPercent(percent)}
    </Badge>
  )
}
