import { useGameBoard } from '../GameBoardContext';
import TilesFooter from './TilesFooter';
import TilesHeader from './TilesHeader';
import TilesInput from './TilesInput';


const Tiles: React.FC = () => {
  const { pattern, setOriginalTiles, originalTiles } = useGameBoard()
  return (
    <div className='space-y-4'>
      <TilesHeader />
      <TilesInput
        maxLength={10}
        value={originalTiles}
        onChange={setOriginalTiles}
        autoCapitalize='on'
        pattern={pattern} />
      <TilesFooter />
    </div>
  );
};

export default Tiles;
