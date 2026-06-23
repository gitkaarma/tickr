import { GitCompareArrows, LineChart, Star } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import { cn } from '@/lib/utils'

const ITEMS = [
  { to: '/', label: 'Markets', icon: LineChart, end: true },
  { to: '/watchlist', label: 'Watchlist', icon: Star, end: false },
  { to: '/compare', label: 'Compare', icon: GitCompareArrows, end: false },
]

/** Bottom tab bar shown only on mobile (the header nav links are hidden there). */
export function BottomNav() {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 backdrop-blur sm:hidden">
      <div className="mx-auto flex max-w-6xl">
        {ITEMS.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              cn(
                'flex flex-1 flex-col items-center gap-0.5 py-2 text-[11px] font-medium',
                isActive ? 'text-primary' : 'text-muted-foreground',
              )
            }
          >
            <Icon className="size-5" />
            {label}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
