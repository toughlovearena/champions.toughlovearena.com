import { HallOfFameEntry } from '../lib/types';

export function ResultsInfo(props: {
  filtered?: HallOfFameEntry[];
}) {
  const count = props.filtered?.length.toString() ?? '???';
  const label = count === '1' ? 'tournament' : 'tournaments';
  return (
    <div style={{ width: '12em', }}>
      Showing {count} {label}
    </div>
  );
}
