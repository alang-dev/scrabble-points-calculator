/**
 * Scrabble scoring rules extracted from backend API tests
 * Each letter has a point value based on its frequency in English
 */

export interface ScoringRule {
  points: number;
  letters: string;
}

export const SCRABBLE_SCORING_RULES: ScoringRule[] = [
  { points: 1, letters: 'AEIOULNSTR' },
  { points: 2, letters: 'DG' },
  { points: 3, letters: 'BCMP' },
  { points: 4, letters: 'FHVWY' },
  { points: 6, letters: 'K' },
  { points: 8, letters: 'JX' },
  { points: 10, letters: 'QZ' }
];


/**
 * Test data for scoring calculations
 */
export const SCORING_TEST_CASES = [
  // Existing test cases
  { word: 'EXCITING', expectedPoints: 18 }, // E=1, X=8, C=3, I=1, T=1, I=1, N=1, G=2
  { word: 'QUIZ', expectedPoints: 22 }, // Q=10, U=1, I=1, Z=10
  { word: 'CAB', expectedPoints: 7 }, // C=3, A=1, B=3
  { word: 'TEST', expectedPoints: 4 }, // T=1, E=1, S=1, T=1
  { word: 'JAZZY', expectedPoints: 33 }, // J=8, A=1, Z=10, Z=10, Y=4
  { word: 'QUIXOTIC', expectedPoints: 26 }, // Q=10, U=1, I=1, X=8, O=1, T=1, I=1, C=3
  { word: 'WAXED', expectedPoints: 16 }, // W=4, A=1, X=8, E=1, D=2

  // Additional test cases from e2e tests
  { word: 'HI', expectedPoints: 5 }, // H=4, I=1
  { word: 'AB', expectedPoints: 4 }, // A=1, B=3
  { word: 'ABZ', expectedPoints: 14 }, // A=1, B=3, Z=10
  { word: 'WIN', expectedPoints: 6 }, // W=4, I=1, N=1
  { word: 'SCRABBLING', expectedPoints: 17 }, // S=1, C=3, R=1, A=1, B=3, B=3, L=1, I=1, N=1, G=2

  // Single letter test cases
  { word: 'A', expectedPoints: 1 }, // A=1
  { word: 'B', expectedPoints: 3 }, // B=3
  { word: 'Z', expectedPoints: 10 }, // Z=10
  { word: 'Q', expectedPoints: 10 }, // Q=10
  { word: 'X', expectedPoints: 8 }, // X=8
];
