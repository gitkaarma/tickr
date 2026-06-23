/** Number / date formatting helpers, centralized so the whole UI stays consistent. */

export function formatPrice(value: number, currency = 'USD'): string {
  if (!isFinite(value)) return '—'
  // Show more precision for sub-$1 instruments (e.g. some FX), less for large prices.
  const fractionDigits = Math.abs(value) >= 1 ? 2 : 4
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      minimumFractionDigits: fractionDigits,
      maximumFractionDigits: fractionDigits,
    }).format(value)
  } catch {
    return `$${value.toFixed(fractionDigits)}`
  }
}

export function formatNumber(value: number): string {
  if (!isFinite(value)) return '—'
  return new Intl.NumberFormat('en-US').format(value)
}

/** Compact notation: 1.2T, 3.4B, 5.6M. */
export function formatCompact(value: number | null | undefined): string {
  if (value == null || !isFinite(value)) return '—'
  return new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 2 }).format(value)
}

export function formatPercent(value: number): string {
  if (!isFinite(value)) return '—'
  return `${value.toFixed(2)}%`
}

/** Percent with an explicit +/- sign, for gain/loss display. */
export function formatSignedPercent(value: number): string {
  if (!isFinite(value)) return '—'
  const sign = value > 0 ? '+' : ''
  return `${sign}${value.toFixed(2)}%`
}

export function formatSigned(value: number, currency = 'USD'): string {
  if (!isFinite(value)) return '—'
  const sign = value > 0 ? '+' : value < 0 ? '-' : ''
  return `${sign}${formatPrice(Math.abs(value), currency)}`
}

export type Direction = 'up' | 'down' | 'flat'

export function direction(value: number): Direction {
  if (value > 0) return 'up'
  if (value < 0) return 'down'
  return 'flat'
}

/** A short, human label for a chart datetime string ("2026-06-22" or "2026-06-22 15:30:00"). */
export function formatAxisDate(datetime: string): string {
  const d = new Date(datetime.includes(' ') ? datetime.replace(' ', 'T') : datetime)
  if (isNaN(d.getTime())) return datetime
  const intraday = datetime.includes(' ') || datetime.includes(':')
  return intraday
    ? d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
    : d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

export function formatFullDate(datetime: string): string {
  const d = new Date(datetime.includes(' ') ? datetime.replace(' ', 'T') : datetime)
  if (isNaN(d.getTime())) return datetime
  return d.toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })
}

/** Relative time from epoch seconds, e.g. "3h ago" (used for news). */
export function formatRelative(epochSeconds: number): string {
  if (!epochSeconds) return ''
  const diffMs = Date.now() - epochSeconds * 1000
  const mins = Math.round(diffMs / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hours = Math.round(mins / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.round(hours / 24)
  return `${days}d ago`
}
