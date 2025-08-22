import { BarChart3, RotateCcw, Save } from 'lucide-react';
import React from 'react';
import { IconButton } from '../base/Button';
import { cn } from '../../lib/utils';

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
      <IconButton variant="outline" icon={RotateCcw} onClick={onReset}>
        Reset
      </IconButton>
      <IconButton variant="primary" icon={Save} onClick={onSave} disabled={!canSave}>
        Save Score
      </IconButton>
      <IconButton variant="secondary" icon={BarChart3} onClick={onViewTopScores}>
        View Top Scores
      </IconButton>
    </div>
  );
};

export default Controls;
