import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'

export function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
      <p className="font-mono text-5xl font-bold text-primary">404</p>
      <p className="text-muted-foreground">That page doesn't exist.</p>
      <Button asChild variant="outline" size="sm">
        <Link to="/">Back to markets</Link>
      </Button>
    </div>
  )
}
