import { useEffect, useState } from 'react';
import api from '../lib/api';

interface ScoreGroups {
  [points: string]: string[];
}

interface ScoringRules {
  scoreGroups: ScoreGroups;
}

export const useScoringRules = () => {
  const [scoringRules, setScoringRules] = useState<ScoringRules | null>(null);
  const [loading, setLoading] = useState(true);
  const [validLetters, setValidLetters] = useState<Set<string>>(new Set());

  useEffect(() => {
    const fetchScoringRules = async () => {
      try {
        setLoading(true);
        const response = await api.get('/scores/rules');
        const rules: ScoringRules = response.data;
        setScoringRules(rules);

        // Extract all valid letters from score groups
        const letters = new Set<string>();
        Object.values(rules.scoreGroups).forEach(letterArray => {
          letterArray.forEach(letter => letters.add(letter.toUpperCase()));
        });
        setValidLetters(letters);
      } catch (err) {
        console.error('Error fetching scoring rules:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchScoringRules();
  }, []);

  return { scoringRules, loading, validLetters };
};