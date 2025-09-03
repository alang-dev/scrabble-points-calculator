import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import TilesFooter from './TilesFooter'

describe('TilesFooter', () => {
  it('should render footer text', () => {
    render(<TilesFooter />)

    expect(screen.getByText('Enter up to 10 letters (see scoring rules below)')).toBeInTheDocument()
  })
})
