import { Section } from '@/components/common/Section'
import { Heatmap } from '@/components/markets/Heatmap'
import { MarketBreadth } from '@/components/markets/MarketBreadth'
import { MarketHero } from '@/components/markets/MarketHero'
import { MarketNews } from '@/components/markets/MarketNews'
import { MarketStrip } from '@/components/markets/MarketStrip'
import { Movers } from '@/components/markets/Movers'

export function Home() {
  return (
    <div className="space-y-8">
      <section className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Markets</h1>
        <p className="text-sm text-muted-foreground">
          Live US and global markets at a glance. Search any symbol to dive in.
        </p>
      </section>

      <MarketHero />

      <MarketStrip />

      <MarketBreadth />

      <Section title="Sector Heatmap">
        <Heatmap />
      </Section>

      <Section title="Top Movers">
        <Movers />
      </Section>

      <Section title="Market News">
        <MarketNews />
      </Section>
    </div>
  )
}
