import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import TilesHeader from './TilesHeader'

describe('TilesHeader', () => {
  it('should render header text', () => {
    render(<TilesHeader />)

    expect(screen.getByText('Enter your Scrabble tiles')).toBeInTheDocument()
  })
})
