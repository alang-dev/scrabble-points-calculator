import { renderHook, waitFor } from '@testing-library/react'
import { vi } from 'vitest'
import api from '../lib/api'
import { useScoringRules } from './useScoringRules'

vi.mock('../lib/api')

describe('useScoringRules', () => {
  afterEach(() => {
    vi.clearAllMocks()
  })

  it('should return initial state', () => {
    vi.mocked(api.get).mockImplementation(() => new Promise(() => {}))

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
    vi.mocked(api.get).mockResolvedValue({ data: mockRules })

    const { result } = renderHook(() => useScoringRules())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(api.get).toHaveBeenCalledWith('/scores/rules')
    expect(result.current.scoringRules).toEqual(mockRules)
    expect(result.current.pattern).toBe('^[AEIOUDGHLMQZaeioudghlmqz]+$')
  })

  it('should handle api error gracefully', async () => {
    vi.mocked(api.get).mockRejectedValue(new Error('API Error'))

    const { result } = renderHook(() => useScoringRules())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.scoringRules).toEqual([])
    expect(result.current.pattern).toBe('')
  })

  it('should set loading to false after successful request', async () => {
    const mockRules = [{ points: 1, letters: 'A' }]
    vi.mocked(api.get).mockResolvedValue({ data: mockRules })

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
    vi.mocked(api.get).mockResolvedValue({ data: mockRules })

    const { result } = renderHook(() => useScoringRules())

    await waitFor(() => {
      expect(result.current.pattern).toBe('^[ABCDabcd]+$')
    })
  })

  it('should handle empty rules array', async () => {
    vi.mocked(api.get).mockResolvedValue({ data: [] })

    const { result } = renderHook(() => useScoringRules())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.scoringRules).toEqual([])
    expect(result.current.pattern).toBe('^[]+$')
  })
})
