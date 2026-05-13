import styles from './Tile.module.css';
import type { TileState } from '../../lib/types';

interface Props {
  digit: string;
  state: TileState;
  revealed?: boolean;
  revealDelay?: number;
  small?: boolean;
}

const FLIP_COLOR: Record<string, string> = {
  green:  'var(--tile-green)',
  yellow: 'var(--tile-yellow)',
  grey:   'var(--tile-grey)',
};

export function Tile({ digit, state, revealed = false, revealDelay = 0, small = false }: Props) {
  const isColoured = state === 'green' || state === 'yellow' || state === 'grey';
  const displayState = revealed ? state : (digit ? 'active' : 'empty');

  return (
    <div
      className={`${styles.tile} ${revealed ? styles.revealed : ''}`}
      data-state={displayState}
      style={{
        animationDelay:                       revealed ? `${revealDelay}ms` : undefined,
        ['--flip-color' as string]:           isColoured ? FLIP_COLOR[state] : undefined,
        width:                                small ? '36px' : undefined,
        height:                               small ? '36px' : undefined,
        fontSize:                             small ? '1rem' : undefined,
      }}
    >
      {digit}
    </div>
  );
}
