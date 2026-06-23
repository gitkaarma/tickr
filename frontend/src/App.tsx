import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { lazy, Suspense } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { isRetryable } from '@/api/client'
import { AppLayout } from '@/components/layout/AppLayout'
import { Spinner } from '@/components/ui/spinner'

// Code-split the routes so the Recharts-heavy detail/compare pages don't bloat the initial bundle.
const Home = lazy(() => import('@/pages/Home').then((m) => ({ default: m.Home })))
const StockDetail = lazy(() => import('@/pages/StockDetail').then((m) => ({ default: m.StockDetail })))
const Compare = lazy(() => import('@/pages/Compare').then((m) => ({ default: m.Compare })))
const Watchlist = lazy(() => import('@/pages/Watchlist').then((m) => ({ default: m.Watchlist })))
const NotFound = lazy(() => import('@/pages/NotFound').then((m) => ({ default: m.NotFound })))

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Only retry when the backend marked the failure transient (rate limit / upstream).
      retry: (failureCount, error) => isRetryable(error) && failureCount < 2,
      refetchOnWindowFocus: false,
    },
  },
})

function RouteFallback() {
  return (
    <div className="flex justify-center py-20">
      <Spinner className="size-6 text-muted-foreground" />
    </div>
  )
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route element={<AppLayout />}>
            <Route
              path="/"
              element={
                <Suspense fallback={<RouteFallback />}>
                  <Home />
                </Suspense>
              }
            />
            <Route
              path="/stocks/:symbol"
              element={
                <Suspense fallback={<RouteFallback />}>
                  <StockDetail />
                </Suspense>
              }
            />
            <Route
              path="/compare"
              element={
                <Suspense fallback={<RouteFallback />}>
                  <Compare />
                </Suspense>
              }
            />
            <Route
              path="/watchlist"
              element={
                <Suspense fallback={<RouteFallback />}>
                  <Watchlist />
                </Suspense>
              }
            />
            <Route
              path="*"
              element={
                <Suspense fallback={<RouteFallback />}>
                  <NotFound />
                </Suspense>
              }
            />
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  )
}

export default App
