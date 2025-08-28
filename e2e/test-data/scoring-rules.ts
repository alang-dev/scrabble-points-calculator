import { ScoringRule } from "../models/Score"

/**
 * Scrabble scoring rules extracted from backend API tests
 * Each letter has a point value based on its frequency in English
 */
export const SCRABBLE_SCORING_RULES: ScoringRule[] = [
  { points: 1, letters: 'AEIOULNSTR' },
  { points: 2, letters: 'DG' },
  { points: 3, letters: 'BCMP' },
  { points: 4, letters: 'FHVWY' },
  { points: 6, letters: 'K' },
  { points: 8, letters: 'JX' },
  { points: 10, letters: 'QZ' },
]

/**
 * Test data for scoring calculations
 */
export const SCORING_TEST_CASES = [
  // Batch 1: All letters from SCRABBLE_SCORING_RULES (using exact letter strings)
  { word: 'AEIOULNSTR', expectedPoints: 10 }, // A=1, E=1, I=1, O=1, U=1, L=1, N=1, S=1, T=1, R=1
  { word: 'DG', expectedPoints: 4 }, // D=2, G=2
  { word: 'BCMP', expectedPoints: 12 }, // B=3, C=3, M=3, P=3
  { word: 'FHVWY', expectedPoints: 20 }, // F=4, H=4, V=4, W=4, Y=4
  { word: 'K', expectedPoints: 6 }, // K=6
  { word: 'JX', expectedPoints: 16 }, // J=8, X=8
  { word: 'QZ', expectedPoints: 20 }, // Q=10, Z=10

  // Variable length cases (1-10 letters, one letter from each point value)
  { word: 'A', expectedPoints: 1 }, // 1 letter: A=1
  { word: 'AD', expectedPoints: 3 }, // 2 letters: A=1, D=2
  { word: 'ADB', expectedPoints: 6 }, // 3 letters: A=1, D=2, B=3
  { word: 'ADBF', expectedPoints: 10 }, // 4 letters: A=1, D=2, B=3, F=4
  { word: 'ADBFK', expectedPoints: 16 }, // 5 letters: A=1, D=2, B=3, F=4, K=6
  { word: 'ADBFKJ', expectedPoints: 24 }, // 6 letters: A=1, D=2, B=3, F=4, K=6, J=8
  { word: 'ADBFKJQ', expectedPoints: 34 }, // 7 letters: A=1, D=2, B=3, F=4, K=6, J=8, Q=10
  { word: 'ADBFKJQG', expectedPoints: 36 }, // 8 letters: A=1, D=2, B=3, F=4, K=6, J=8, Q=10, G=2
  { word: 'ADBFKJQGC', expectedPoints: 39 }, // 9 letters: A=1, D=2, B=3, F=4, K=6, J=8, Q=10, G=2, C=3
  { word: 'ADBFKJQGCH', expectedPoints: 43 }, // 10 letters: A=1, D=2, B=3, F=4, K=6, J=8, Q=10, G=2, C=3, H=4
]
