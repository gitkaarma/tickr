import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import type { Candle } from '@/api/types'
import { formatAxisDate, formatFullDate, formatPrice } from '@/lib/format'

function axisPrice(value: number): string {
  if (Math.abs(value) >= 1000) return `$${Math.round(value).toLocaleString('en-US')}`
  return `$${value.toFixed(Math.abs(value) < 10 ? 2 : 0)}`
}

// Recharts passes loosely-typed props to a custom tooltip.
function ChartTooltip({ active, payload, label, currency }: any) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-lg border border-border bg-popover px-3 py-2 text-xs shadow-xl">
      <div className="text-muted-foreground">{formatFullDate(String(label))}</div>
      <div className="font-mono font-semibold text-foreground">
        {formatPrice(payload[0].value as number, currency)}
      </div>
    </div>
  )
}

export function AreaPriceChart({
  candles,
  currency = 'USD',
  height = 320,
}: {
  candles: Candle[]
  currency?: string
  height?: number
}) {
  if (candles.length === 0) return null

  const up = candles[candles.length - 1].close >= candles[0].close
  const color = up ? 'var(--color-up)' : 'var(--color-down)'
  const data = candles.map((c) => ({ datetime: c.datetime, close: c.close }))
  const closes = candles.map((c) => c.close)
  const min = Math.min(...closes)
  const max = Math.max(...closes)
  const pad = (max - min) * 0.12 || max * 0.02

  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data} margin={{ top: 10, right: 4, bottom: 0, left: 4 }}>
        <defs>
          <linearGradient id="priceFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.35} />
            <stop offset="100%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <XAxis
          dataKey="datetime"
          tickFormatter={formatAxisDate}
          tick={{ fill: 'var(--color-muted-foreground)', fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          minTickGap={44}
        />
        <YAxis
          domain={[min - pad, max + pad]}
          tickFormatter={axisPrice}
          tick={{ fill: 'var(--color-muted-foreground)', fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          width={56}
          orientation="right"
        />
        <Tooltip content={<ChartTooltip currency={currency} />} />
        <Area type="monotone" dataKey="close" stroke={color} strokeWidth={2} fill="url(#priceFill)" />
      </AreaChart>
    </ResponsiveContainer>
  )
}
