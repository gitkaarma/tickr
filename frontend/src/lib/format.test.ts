import { describe, expect, it } from 'vitest'
import { direction, formatCompact, formatPercent, formatSignedPercent } from './format'

describe('format helpers', () => {
  it('formatSignedPercent prefixes a + only for positives', () => {
    expect(formatSignedPercent(1.234)).toBe('+1.23%')
    expect(formatSignedPercent(-0.5)).toBe('-0.50%')
    expect(formatSignedPercent(0)).toBe('0.00%')
  })

  it('formatPercent has no sign', () => {
    expect(formatPercent(2.5)).toBe('2.50%')
  })

  it('formatCompact uses compact notation and handles null', () => {
    expect(formatCompact(3_400_000_000)).toBe('3.4B')
    expect(formatCompact(null)).toBe('—')
  })

  it('direction classifies the move', () => {
    expect(direction(1)).toBe('up')
    expect(direction(-1)).toBe('down')
    expect(direction(0)).toBe('flat')
  })
})
