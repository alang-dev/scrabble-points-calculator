import { renderHook } from '@testing-library/react'
import React from 'react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { GameBoardProvider } from '../GameBoardContext'
import { useGameBoard } from './useGameBoard'

// Mock the dependencies for GameBoardProvider
const mockUseScoreCompute = vi.fn()
const mockUseScoringRules = vi.fn()

vi.mock('../../../hooks/useScoreCompute', () => ({
  useScoreCompute: () => mockUseScoreCompute(),
}))

vi.mock('../../../hooks/useScoringRules', () => ({
  useScoringRules: () => mockUseScoringRules(),
}))

// API is mocked globally, no need to mock here

vi.mock('../../base/Toast/toast', () => ({
  toast: {
    success: vi.fn(),
  },
}))

describe('useGameBoard', () => {
  beforeEach(() => {
    vi.clearAllMocks()

    // Set up default mock values for GameBoardProvider
    mockUseScoreCompute.mockReturnValue({
      isLoading: false,
      computedScore: { score: 25 },
    })

    mockUseScoringRules.mockReturnValue({
      pattern: 'test-pattern',
      scoringRules: [
        { letters: 'A', points: 1 },
        { letters: 'E', points: 1 },
      ],
    })
  })

  it('should return context value when used within GameBoardProvider', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) =>
      React.createElement(GameBoardProvider, null, children)

    const { result } = renderHook(() => useGameBoard(), { wrapper })

    expect(result.current).toBeDefined()
    expect(result.current.originalTiles).toBe('')
    expect(result.current.isScoreComputing).toBe(false)
    expect(result.current.scoreValue).toBe(25)
    expect(result.current.pattern).toBe('test-pattern')
    expect(result.current.scoringRules).toHaveLength(2)
    expect(typeof result.current.setOriginalTiles).toBe('function')
    expect(typeof result.current.handleReset).toBe('function')
    expect(typeof result.current.handleSave).toBe('function')
    expect(typeof result.current.canSave).toBe('boolean')
  })

  it('should throw error when used outside of GameBoardProvider', () => {
    // Test the hook without any provider wrapper
    expect(() => {
      renderHook(() => useGameBoard())
    }).toThrow('useGameBoard must be used within a GameBoardProvider')
  })

  it('should return updated context values when provider state changes', () => {
    // Mock loading state
    mockUseScoreCompute.mockReturnValue({
      isLoading: true,
      computedScore: null,
    })

    const wrapper = ({ children }: { children: React.ReactNode }) =>
      React.createElement(GameBoardProvider, null, children)

    const { result } = renderHook(() => useGameBoard(), { wrapper })

    expect(result.current.isScoreComputing).toBe(true)
    expect(result.current.scoreValue).toBe('--')
    expect(result.current.canSave).toBe(false)
  })

  it('should return context with different scoring rules', () => {
    const customRules = [
      { letters: 'X', points: 8 },
      { letters: 'Y', points: 4 },
      { letters: 'Z', points: 10 },
    ]

    mockUseScoringRules.mockReturnValue({
      pattern: 'custom-pattern',
      scoringRules: customRules,
    })

    const wrapper = ({ children }: { children: React.ReactNode }) =>
      React.createElement(GameBoardProvider, null, children)

    const { result } = renderHook(() => useGameBoard(), { wrapper })

    expect(result.current.pattern).toBe('custom-pattern')
    expect(result.current.scoringRules).toHaveLength(3)
    expect(result.current.scoringRules).toEqual(customRules)
  })
})
