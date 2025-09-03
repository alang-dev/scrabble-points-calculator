import { renderHook, waitFor } from '@testing-library/react'
import { vi } from 'vitest'
import { useScoringRules } from './useScoringRules'
import { mockApiGet } from '../test/apiMocks'

describe('useScoringRules', () => {
  afterEach(() => {
    vi.clearAllMocks()
  })

  it('should return initial state', () => {
    mockApiGet.mockImplementation(() => new Promise(() => {}))

    const { result } = renderHook(() => useScoringRules())

    expect(result.current.scoringRules).toEqual([])
    expect(result.current.loading).toBe(true)
    expect(result.current.pattern).toBe('')
  })

  it('should fetch scoring rules and create pattern', async () => {
    const mockRules = [
      { points: 1, letters: 'AEIOU' },
      { points: 3, letters: 'DGHLM' },
      { points: 10, letters: 'QZ' },
    ]
    mockApiGet.mockResolvedValue({ data: mockRules })

    const { result } = renderHook(() => useScoringRules())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(mockApiGet).toHaveBeenCalledWith('/scores/rules')
    expect(result.current.scoringRules).toEqual(mockRules)
    expect(result.current.pattern).toBe('^[AEIOUDGHLMQZaeioudghlmqz]+$')
  })

  it('should handle api error gracefully', async () => {
    mockApiGet.mockRejectedValue(new Error('API Error'))

    const { result } = renderHook(() => useScoringRules())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.scoringRules).toEqual([])
    expect(result.current.pattern).toBe('')
  })

  it('should set loading to false after successful request', async () => {
    const mockRules = [{ points: 1, letters: 'A' }]
    mockApiGet.mockResolvedValue({ data: mockRules })

    const { result } = renderHook(() => useScoringRules())

    expect(result.current.loading).toBe(true)

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })
  })

  it('should create case-insensitive pattern from multiple rules', async () => {
    const mockRules = [
      { points: 1, letters: 'AB' },
      { points: 2, letters: 'CD' },
    ]
    mockApiGet.mockResolvedValue({ data: mockRules })

    const { result } = renderHook(() => useScoringRules())

    await waitFor(() => {
      expect(result.current.pattern).toBe('^[ABCDabcd]+$')
    })
  })

  it('should handle empty rules array', async () => {
    mockApiGet.mockResolvedValue({ data: [] })

    const { result } = renderHook(() => useScoringRules())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.scoringRules).toEqual([])
    expect(result.current.pattern).toBe('^[]+$')
  })
})
