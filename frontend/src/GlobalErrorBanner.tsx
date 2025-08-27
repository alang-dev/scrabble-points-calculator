import { AlertCircle, X } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { setGlobalErrorHandler } from './lib/api';

const GlobalErrorBanner: React.FC = () => {
  const [error, setError] = useState<string | null>(null);

  // Set up global error handler on mount
  useEffect(() => {
    setGlobalErrorHandler((message: string) => {
      setError(message);
      // Auto-hide error after 5 seconds
      setTimeout(() => setError(null), 5000);
    });
  }, []);

  const handleDismiss = () => {
    setError(null);
  };

  if (!error) return null;

  return (
    <div 
      data-testid="error-banner"
      className="max-w-4xl mx-auto mb-4 bg-red-50 border border-red-200 rounded-lg p-4 flex items-center justify-between"
    >
      <div className="flex items-center">
        <AlertCircle className="w-5 h-5 text-red-600 mr-3" />
        <p className="text-red-800 text-sm font-medium">{error}</p>
      </div>
      <button
        onClick={handleDismiss}
        className="text-red-600 hover:text-red-800 ml-4"
        aria-label="Dismiss error"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

export default GlobalErrorBanner;
