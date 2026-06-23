import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import type { CompareResult } from '@/api/types'
import { formatAxisDate, formatFullDate, formatSignedPercent } from '@/lib/format'

export const COMPARE_COLORS = ['var(--color-primary)', '#f6c945', '#5b8def', '#ef6ea8']

function CompareTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-lg border border-border bg-popover px-3 py-2 text-xs shadow-xl">
      <div className="mb-1 text-muted-foreground">{formatFullDate(String(label))}</div>
      <div className="space-y-0.5">
        {payload.map((p: any) => (
          <div key={p.dataKey} className="flex items-center justify-between gap-3">
            <span className="flex items-center gap-1.5" style={{ color: p.color }}>
              <span className="inline-block size-2 rounded-full" style={{ backgroundColor: p.color }} />
              {p.dataKey}
            </span>
            <span className="font-mono tabular-nums text-foreground">
              {formatSignedPercent(p.value as number)}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

export function CompareChart({ result }: { result: CompareResult }) {
  const byDate = new Map<string, Record<string, number | string>>()
  result.series.forEach((s) => {
    s.points.forEach((p) => {
      const row = byDate.get(p.datetime) ?? { datetime: p.datetime }
      row[s.symbol] = p.value
      byDate.set(p.datetime, row)
    })
  })
  const data = Array.from(byDate.values()).sort((a, b) =>
    String(a.datetime).localeCompare(String(b.datetime)),
  )

  return (
    <ResponsiveContainer width="100%" height={360}>
      <LineChart data={data} margin={{ top: 10, right: 4, bottom: 0, left: 4 }}>
        <XAxis
          dataKey="datetime"
          tickFormatter={formatAxisDate}
          tick={{ fill: 'var(--color-muted-foreground)', fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          minTickGap={44}
        />
        <YAxis
          tickFormatter={(v: number) => `${v > 0 ? '+' : ''}${Math.round(v)}%`}
          tick={{ fill: 'var(--color-muted-foreground)', fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          width={52}
          orientation="right"
        />
        <Tooltip content={<CompareTooltip />} />
        {result.series.map((s, i) => (
          <Line
            key={s.symbol}
            type="monotone"
            dataKey={s.symbol}
            stroke={COMPARE_COLORS[i % COMPARE_COLORS.length]}
            dot={false}
            strokeWidth={2}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  )
}
