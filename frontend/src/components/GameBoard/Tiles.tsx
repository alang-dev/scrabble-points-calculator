import React from 'react';
import { InputOTP, InputOTPSlot } from '../base/Tile';

interface TilesProps {
  value: string; // 10-character string representing all tiles
  onChange: (value: string) => void;
  className?: string;
  maxLength?: number; // Default to 10 tiles
}

const Tiles: React.FC<TilesProps> = ({ value, onChange, className, maxLength = 10 }) => {
  const handleValueChange = (newValue: string) => {
    const uppercaseValue = newValue.toUpperCase();
    onChange(uppercaseValue);
  };

  return (
    <div className={`flex justify-center ${className || ''}`}>
      <InputOTP
        maxLength={maxLength}
        value={value}
        onChange={handleValueChange}
        containerClassName="group flex items-center has-[:disabled]:opacity-30 gap-3"
      >
        {Array.from({ length: maxLength }, (_, index) => (
          <InputOTPSlot
            key={index}
            index={index}
            className="h-16 w-16 text-xl font-bold border rounded-lg"
          />
        ))}
      </InputOTP>
    </div>
  );
};

export default Tiles;
