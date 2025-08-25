import GameBoard from './components/GameBoard/GameBoard';
import GlobalErrorBanner from './GlobalErrorBanner';
import { Toaster } from './components/base/Toast/Toaster';

function App() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-8">
          Scrabble Points Calculator
        </h1>

        <GlobalErrorBanner />

        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8">
          <GameBoard />
        </div>
      </div>

      <Toaster />
    </div>
  );
}

export default App;
