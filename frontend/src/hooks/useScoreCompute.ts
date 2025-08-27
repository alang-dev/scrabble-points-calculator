import { useEffect, useState } from 'react'
import api from '../lib/api'

interface ScoreResult {
  letters: string
  score: number
}

interface ScoreComputeResult {
  isLoading: boolean
  computedScore: ScoreResult | null
}

export const useScoreCompute = (tiles: string, debounceMs: number = 300): ScoreComputeResult => {
  const [isLoading, setIsLoading] = useState(false)
  const [computedScore, setComputedScore] = useState<ScoreResult | null>(null)
  useEffect(() => {
    let timeoutId: NodeJS.Timeout | null = null

    const resetState = () => {
      setComputedScore(null)
      setIsLoading(false)
    }

    if (!tiles) {
      resetState()
      return () => {
        if (timeoutId) clearTimeout(timeoutId)
      }
    }

    setIsLoading(true)

    timeoutId = setTimeout(() => {
      api
        .post('/scores/compute', {
          letters: tiles.toUpperCase(),
        })
        .then(response => {
          const scoreResult: ScoreResult = response.data
          setComputedScore(scoreResult)
          setIsLoading(false)
        })
        .catch(resetState)
    }, debounceMs)

    return () => {
      if (timeoutId) clearTimeout(timeoutId)
    }
  }, [tiles, debounceMs])

  return {
    isLoading,
    computedScore,
  }
}
