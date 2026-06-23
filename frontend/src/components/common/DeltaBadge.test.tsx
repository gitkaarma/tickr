import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { DeltaBadge } from './DeltaBadge'

describe('DeltaBadge', () => {
  it('renders a positive move with a + sign', () => {
    render(<DeltaBadge percent={2.5} />)
    expect(screen.getByText('+2.50%')).toBeInTheDocument()
  })

  it('renders a negative move', () => {
    render(<DeltaBadge percent={-1.1} />)
    expect(screen.getByText('-1.10%')).toBeInTheDocument()
  })
})
