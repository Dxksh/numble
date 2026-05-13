import { Tile } from '../Tile/Tile';
import styles from './GuessRow.module.css';
import type { TileState } from '../../lib/types';

interface Props {
  digits: string[];
  results: TileState[];
  revealed?: boolean;
  shake?: boolean;
  small?: boolean;
}

export function GuessRow({ digits, results, revealed = false, shake = false, small = false }: Props) {
  return (
    <div className={`${styles.row} ${shake ? styles.shake : ''}`}>
      {Array.from({ length: 5 }, (_, i) => (
        <Tile
          key={i}
          digit={digits[i] ?? ''}
          state={revealed ? results[i] : (digits[i] ? 'active' : 'empty')}
          revealed={revealed}
          revealDelay={i * 100}
          small={small}
        />
      ))}
    </div>
  );
}
