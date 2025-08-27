import { useEffect, useState } from 'react'
import api from '../lib/api'

interface ScoringRule {
  points: number
  letters: string
}

type ScoringRules = ScoringRule[]

export const useScoringRules = () => {
  const [data, setData] = useState<{ rules: ScoringRules; pattern: string }>({
    rules: [],
    pattern: '',
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)

    api
      .get('/scores/rules')
      .then(response => {
        const rules: ScoringRules = response.data
        const letters = rules.map(rule => rule.letters).join('')
        const pattern = `^[${letters}${letters.toLowerCase()}]+$`

        setData({ rules, pattern })
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  return { scoringRules: data.rules, loading, pattern: data.pattern }
}
