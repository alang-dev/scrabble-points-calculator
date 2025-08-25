export interface Score {
  id: string;
  points: number;
  letters: string;
}

export interface TopScore extends Score {
  rank: number;
  createdAt: string;
}