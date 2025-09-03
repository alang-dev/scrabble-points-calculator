import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import App from './App'

// Mock the GameBoard component
vi.mock('./components/GameBoard/GameBoard', () => ({
  default: () => <div data-testid="game-board">Game Board</div>,
}))

// Mock the GlobalErrorBanner component
vi.mock('./GlobalErrorBanner', () => ({
  default: () => <div data-testid="global-error-banner">Global Error Banner</div>,
}))

// Mock the Toaster component
vi.mock('./components/base/Toast/Toaster', () => ({
  Toaster: () => <div data-testid="toaster">Toaster</div>,
}))

describe('App', () => {
  it('should render the main app structure', () => {
    render(<App />)

    expect(screen.getByText('Scrabble Points Calculator')).toBeInTheDocument()
    expect(screen.getByTestId('game-board')).toBeInTheDocument()
    expect(screen.getByTestId('global-error-banner')).toBeInTheDocument()
    expect(screen.getByTestId('toaster')).toBeInTheDocument()
  })

  it('should have proper CSS classes applied', () => {
    const { container } = render(<App />)

    const mainDiv = container.firstChild
    expect(mainDiv).toHaveClass('min-h-screen', 'bg-gray-50', 'py-8')
  })

  it('should render the title with correct styling', () => {
    render(<App />)

    const title = screen.getByText('Scrabble Points Calculator')
    expect(title).toHaveClass('text-3xl', 'font-bold', 'text-center', 'text-gray-900', 'mb-8')
  })
})
