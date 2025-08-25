import { useEffect, useState } from 'react';
import api from '../lib/api';

interface ScoreEntry {
  rank: number;
  score: number;
  letters: string;
  createdAt: string;
}

export const useTopScores = (isOpen: boolean) => {
  const [scores, setScores] = useState<ScoreEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    setIsLoading(true);
    api.get('/scores', {
      params: {
        limit: 10,
        sort: ['points,desc', 'createdAt,asc']
      }
    })
    .then(response => {
      setScores(response.data);
    })
    .finally(() => {
      setIsLoading(false);
    });
  }, [isOpen]);

  return { scores, isLoading };
};
