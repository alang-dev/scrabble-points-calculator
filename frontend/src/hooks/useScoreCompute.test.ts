import { renderHook, act } from '@testing-library/react'
import { vi } from 'vitest'
import api from '../lib/api'
import { useScoreCompute } from './useScoreCompute'

vi.mock('../lib/api')

describe('useScoreCompute', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.clearAllMocks()
  })

  it('should call api with uppercase tiles after debounce', async () => {
    const tiles = 'hello'
    const scoreResult = { letters: 'HELLO', score: 8 }
    vi.mocked(api.post).mockResolvedValue({ data: scoreResult })

    const { result } = renderHook(() => useScoreCompute(tiles, 500))

    expect(result.current.isLoading).toBe(true)
    expect(api.post).not.toHaveBeenCalled()

    await act(async () => {
      vi.advanceTimersByTime(500)
    })

    await vi.waitFor(() => {
      expect(api.post).toHaveBeenCalledWith('/scores/compute', { letters: 'HELLO' })
    })

    await vi.waitFor(() => {
      expect(result.current.isLoading).toBe(false)
      expect(result.current.computedScore).toEqual(scoreResult)
    })
  })

  it('should return initial state', () => {
    const { result } = renderHook(() => useScoreCompute(''))
    expect(result.current.isLoading).toBe(false)
    expect(result.current.computedScore).toBeNull()
  })

  it('should not call api when tiles are empty', () => {
    renderHook(() => useScoreCompute(''))
    expect(api.post).not.toHaveBeenCalled()
  })

  it('should reset state on api error', async () => {
    const tiles = 'error'
    vi.mocked(api.post).mockRejectedValue(new Error('API Error'))

    const { result } = renderHook(() => useScoreCompute(tiles, 500))

    expect(result.current.isLoading).toBe(true)

    await act(async () => {
      vi.advanceTimersByTime(500)
    })

    await vi.waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(result.current.computedScore).toBeNull()
  })

  it('should handle rapid changes in tiles value', async () => {
    const scoreResult = { letters: 'WORLD', score: 9 }
    vi.mocked(api.post).mockResolvedValue({ data: scoreResult })

    const { result, rerender } = renderHook(({ tiles }) => useScoreCompute(tiles, 500), {
      initialProps: { tiles: 'wor' },
    })

    expect(result.current.isLoading).toBe(true)

    rerender({ tiles: 'world' })
    await act(async () => {
      vi.advanceTimersByTime(300) // Not enough time for the first call
    })

    expect(api.post).not.toHaveBeenCalled()

    await act(async () => {
      vi.advanceTimersByTime(200) // Enough time for the second call
    })

    await vi.waitFor(() => {
      expect(api.post).toHaveBeenCalledWith('/scores/compute', { letters: 'WORLD' })
    })

    await vi.waitFor(() => {
      expect(result.current.isLoading).toBe(false)
      expect(result.current.computedScore).toEqual(scoreResult)
    })
  })

  it('should reset state when tiles are cleared', () => {
    const { result, rerender } = renderHook(({ tiles }) => useScoreCompute(tiles), {
      initialProps: { tiles: 'hello' },
    })

    rerender({ tiles: '' })

    expect(result.current.isLoading).toBe(false)
    expect(result.current.computedScore).toBeNull()
  })

  it('should clear timeout on unmount', () => {
    const clearTimeoutSpy = vi.spyOn(global, 'clearTimeout')
    const { unmount } = renderHook(() => useScoreCompute('abc'))

    unmount()

    expect(clearTimeoutSpy).toHaveBeenCalled()
  })
})
