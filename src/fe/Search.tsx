import styled from 'styled-components';
import { HallOfFameType, Options, ViewAll, ViewOption } from '../lib/types';


const OptionSelect = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;
const CategorySelect = styled.div<{ highlight: boolean }>`
  cursor: pointer;
  font-size: 0.8rem;

  margin: 1em 0.5em;
  padding: 0.5em 1em;

  border-radius: 2rem;
  border: 1px solid white;

  background-color: ${props => props.highlight ? 'white' : 'black'};
  color: ${props => props.highlight ? 'black' : 'white'};

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;
const SearchBar = styled.input`
  font-size: 1rem;
  border-radius: 1em;
  width: 10em;

  margin: 1em 0.5em;
  padding: 0.4em 1em;
`;


function OptionName(vo: ViewOption) {
  if (vo === ViewAll) {
    return 'All';
  }
  return {
    [HallOfFameType.Official]: 'Official',
    [HallOfFameType.Community]: 'Community',
  }[vo];
}

export function Search(props: {
  view: ViewOption;
  setView(vo: ViewOption): void;
  query: string;
  setQuery(query: string): void;
}) {
  return (
    <OptionSelect>
      {Options.map(vo => (
        <CategorySelect
          key={vo}
          highlight={vo === props.view}
          onClick={() => props.setView(vo)}
        >
          {OptionName(vo)}
        </CategorySelect>
      ))}
      <SearchBar
        placeholder="Filter events"
        value={props.query}
        onChange={e => props.setQuery(e.target.value)}
      />
    </OptionSelect>
  );
}
