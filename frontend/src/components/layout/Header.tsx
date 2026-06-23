import { TrendingUp } from 'lucide-react'
import { Link, NavLink } from 'react-router-dom'
import { SearchCommand } from '@/components/search/SearchCommand'
import { cn } from '@/lib/utils'

function NavItem({ to, label, end }: { to: string; label: string; end?: boolean }) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        cn(
          'rounded-lg px-3 py-1.5 text-sm font-medium transition-colors',
          isActive ? 'text-foreground' : 'text-muted-foreground hover:text-foreground',
        )
      }
    >
      {label}
    </NavLink>
  )
}

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-6xl items-center gap-3 px-4">
        <Link to="/" className="flex shrink-0 items-center gap-2 text-primary">
          <TrendingUp className="size-6" strokeWidth={2.5} />
          <span className="text-lg font-bold tracking-tight text-foreground">Tickr</span>
        </Link>
        <nav className="hidden items-center gap-0.5 sm:flex">
          <NavItem to="/" label="Markets" end />
          <NavItem to="/watchlist" label="Watchlist" />
          <NavItem to="/compare" label="Compare" />
        </nav>
        <div className="ml-auto w-full max-w-[16rem] sm:w-auto">
          <SearchCommand />
        </div>
      </div>
    </header>
  )
}
