import { cva, type VariantProps } from 'class-variance-authority'
import type { ComponentProps } from 'react'
import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-xs font-medium tabular-nums',
  {
    variants: {
      variant: {
        up: 'bg-up-soft text-up',
        down: 'bg-down-soft text-down',
        flat: 'bg-secondary text-muted-foreground',
        outline: 'border border-border text-muted-foreground',
      },
    },
    defaultVariants: { variant: 'flat' },
  },
)

type BadgeProps = ComponentProps<'span'> & VariantProps<typeof badgeVariants>

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />
}
