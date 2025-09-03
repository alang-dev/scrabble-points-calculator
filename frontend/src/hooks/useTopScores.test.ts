import { renderHook, waitFor } from '@testing-library/react'
import { vi } from 'vitest'
import api from '../lib/api'
import { useTopScores } from './useTopScores'

vi.mock('../lib/api')

describe('useTopScores', () => {
  afterEach(() => {
    vi.clearAllMocks()
  })

  it('should return initial state', () => {
    const { result } = renderHook(() => useTopScores(false))

    expect(result.current.scores).toEqual([])
    expect(result.current.isLoading).toBe(false)
  })

  it('should not fetch scores when isOpen is false', () => {
    renderHook(() => useTopScores(false))

    expect(api.get).not.toHaveBeenCalled()
  })

  it('should fetch top scores when isOpen is true', async () => {
    const mockScores = [
      { rank: 1, score: 100, letters: 'HELLO', createdAt: '2023-01-01T00:00:00Z' },
      { rank: 2, score: 80, letters: 'WORLD', createdAt: '2023-01-02T00:00:00Z' },
    ]
    vi.mocked(api.get).mockResolvedValue({ data: mockScores })

    const { result } = renderHook(() => useTopScores(true))

    expect(result.current.isLoading).toBe(true)

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(api.get).toHaveBeenCalledWith('/scores', {
      params: {
        limit: 10,
        sort: ['points,desc', 'createdAt,asc'],
      },
    })
    expect(result.current.scores).toEqual(mockScores)
  })

  it('should handle api error gracefully', async () => {
    vi.mocked(api.get).mockRejectedValue(new Error('API Error'))

    const { result } = renderHook(() => useTopScores(true))

    expect(result.current.isLoading).toBe(true)

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(result.current.scores).toEqual([])
  })

  it('should refetch when isOpen changes from false to true', async () => {
    const mockScores = [{ rank: 1, score: 50, letters: 'TEST', createdAt: '2023-01-01T00:00:00Z' }]
    vi.mocked(api.get).mockResolvedValue({ data: mockScores })

    const { result, rerender } = renderHook(({ isOpen }) => useTopScores(isOpen), {
      initialProps: { isOpen: false },
    })

    expect(api.get).not.toHaveBeenCalled()

    rerender({ isOpen: true })

    expect(result.current.isLoading).toBe(true)

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(api.get).toHaveBeenCalledTimes(1)
    expect(result.current.scores).toEqual(mockScores)
  })

  it('should not refetch when isOpen changes from true to false', async () => {
    const mockScores = [{ rank: 1, score: 50, letters: 'TEST', createdAt: '2023-01-01T00:00:00Z' }]
    vi.mocked(api.get).mockResolvedValue({ data: mockScores })

    const { result, rerender } = renderHook(({ isOpen }) => useTopScores(isOpen), {
      initialProps: { isOpen: true },
    })

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(api.get).toHaveBeenCalledTimes(1)

    rerender({ isOpen: false })

    expect(api.get).toHaveBeenCalledTimes(1)
  })

  it('should refetch when isOpen becomes true again', async () => {
    const mockScores = [{ rank: 1, score: 60, letters: 'AGAIN', createdAt: '2023-01-01T00:00:00Z' }]
    vi.mocked(api.get).mockResolvedValue({ data: mockScores })

    const { result, rerender } = renderHook(({ isOpen }) => useTopScores(isOpen), {
      initialProps: { isOpen: true },
    })

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(api.get).toHaveBeenCalledTimes(1)

    rerender({ isOpen: false })
    rerender({ isOpen: true })

    expect(result.current.isLoading).toBe(true)

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(api.get).toHaveBeenCalledTimes(2)
  })

  it('should handle empty scores response', async () => {
    vi.mocked(api.get).mockResolvedValue({ data: [] })

    const { result } = renderHook(() => useTopScores(true))

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(result.current.scores).toEqual([])
  })
})
