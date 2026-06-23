import { Outlet } from 'react-router-dom'
import { ErrorBoundary } from '@/components/common/ErrorBoundary'
import { BottomNav } from './BottomNav'
import { Header } from './Header'
import { WakeBanner } from './WakeBanner'

export function AppLayout() {
  return (
    <div className="flex min-h-svh flex-col">
      <Header />
      <WakeBanner />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6">
        <ErrorBoundary>
          <Outlet />
        </ErrorBoundary>
      </main>
      <footer className="border-t border-border pb-20 sm:pb-0">
        <div className="mx-auto flex max-w-6xl flex-col justify-between gap-1 px-4 py-6 text-xs text-muted-foreground sm:flex-row">
          <span>Tickr · Global Equity &amp; ETF Tracker</span>
          <span>
            Data: Twelve Data &amp; Finnhub · For demonstration only, not investment advice.
          </span>
        </div>
      </footer>
      <BottomNav />
    </div>
  )
}
