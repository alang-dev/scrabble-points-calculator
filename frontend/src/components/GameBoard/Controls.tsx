import { BarChart3, RotateCcw, Save } from 'lucide-react';
import React from 'react';
import { cn } from '../../lib/utils';
import { IconButton } from '../base/Button';

interface ControlsProps {
  onReset: () => void;
  onSave: () => void;
  onViewTopScores: () => void;
  canSave: boolean;
  className?: string;
}

const Controls: React.FC<ControlsProps> = ({
  onReset,
  onSave,
  onViewTopScores,
  canSave,
  className
}) => {
  return (
    <div className={cn("flex justify-center gap-4", className)}>
      <IconButton variant="outline" icon={RotateCcw} onClick={onReset} data-testid="reset-button">
        Reset
      </IconButton>
      <IconButton variant="primary" icon={Save} onClick={onSave} disabled={!canSave} data-testid="save-button">
        Save Score
      </IconButton>
      <IconButton variant="secondary" icon={BarChart3} onClick={onViewTopScores} data-testid="view-top-scores-button">
        View Top Scores
      </IconButton>
    </div>
  );
};

export default Controls;
