export interface Score {
  id: string
  points: number
  letters: string
}

export interface TopScore extends Score {
  rank: number
  createdAt: string
}

export interface ScoringRule {
  points: number
  letters: string
}
