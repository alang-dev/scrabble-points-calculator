import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import GameBoard from './GameBoard'

// Mock all the child components
vi.mock('./ScoreDisplay', () => ({
  default: () => <div data-testid="score-display-component">ScoreDisplay</div>,
}))

vi.mock('./Tiles', () => ({
  default: () => <div data-testid="tiles-component">Tiles</div>,
}))

vi.mock('./Controls', () => ({
  default: () => <div data-testid="controls-component">Controls</div>,
}))

vi.mock('./ScoringRulesTable', () => ({
  default: () => <div data-testid="scoring-rules-table-component">ScoringRulesTable</div>,
}))

// Mock the GameBoardProvider
vi.mock('./GameBoardContext', () => ({
  GameBoardProvider: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="gameboard-provider">{children}</div>
  ),
}))

describe('GameBoard', () => {
  it('should render all child components', () => {
    render(<GameBoard />)

    expect(screen.getByTestId('score-display-component')).toBeInTheDocument()
    expect(screen.getByTestId('tiles-component')).toBeInTheDocument()
    expect(screen.getByTestId('controls-component')).toBeInTheDocument()
    expect(screen.getByTestId('scoring-rules-table-component')).toBeInTheDocument()
  })

  it('should wrap components with GameBoardProvider', () => {
    render(<GameBoard />)

    expect(screen.getByTestId('gameboard-provider')).toBeInTheDocument()
  })

  it('should render components in correct order', () => {
    const { container } = render(<GameBoard />)

    const components = container.querySelectorAll('[data-testid]')
    const componentTestIds = Array.from(components).map(el => el.getAttribute('data-testid'))

    // Should have provider wrapping the container
    expect(componentTestIds[0]).toBe('gameboard-provider')

    // Check the order of child components within the container
    const childComponents = container.querySelectorAll(
      '[data-testid="gameboard-provider"] > div > [data-testid]'
    )
    const childTestIds = Array.from(childComponents).map(el => el.getAttribute('data-testid'))

    expect(childTestIds).toEqual([
      'score-display-component',
      'tiles-component',
      'controls-component',
      'scoring-rules-table-component',
    ])
  })

  it('should apply correct spacing classes to container', () => {
    const { container } = render(<GameBoard />)

    const gameboardContainer = container.querySelector('[data-testid="gameboard-provider"] > div')
    expect(gameboardContainer).toHaveClass('space-y-8')
  })
})
