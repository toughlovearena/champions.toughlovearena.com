import { useCallback, useState } from "react";
import styled from 'styled-components';
import { HallOfFameData, HallOfFameEntry, OptionName, ViewAll, ViewOption } from "../lib/types";
import { getNextInArray, range, sortArrayOfObjects } from "../lib/util";

const TableDiv = styled.div`
  font-size: 20px;
`;
const LeaderboardHeader = styled.div`
  & > * > * {
    padding-left: 0;
  }
`;
const LeaderboardBody = styled.div`
  & > *:nth-child(odd) {
    background: #202020;
  }
  & > *:hover {
    color: black;
    background-color: var(--heart);
  }
`;
const FlexRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
`;
const NormalCell = styled.div<{ isClickable?: boolean, }>`
  box-sizing: border-box;
  padding: 0.2em 1em;
  padding-right: 0;
  width: 8em;

  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;

  ${props => props.isClickable ? `
    cursor: pointer;
  `: ''}
`;
const DateCell = styled(NormalCell)`
  width: 6em;
`;
const NameCell = styled(NormalCell)`
  width: 15em;
`;
const ChampionCell = styled(NormalCell)`
  width: 10em;
`;
const EntrantsCell = styled(NormalCell)`
  width: 6em;
`;
const CategoryCell = styled(NormalCell)`
  width: 6em;
`;
const LinksCell = styled(NormalCell)`
  width: 10em;
  justify-content: flex-start;

  a {
    color: white;
    margin-right: 0.5em;
  }
`;

enum SortBy {
  Date,
  TournamentName,
  WinnerName,
  EntrantNum,
}
enum SortOrder {
  Ascending,
  Descending,
}
const DefaultOrder: Record<SortBy, SortOrder> = {
  [SortBy.Date]: SortOrder.Descending,
  [SortBy.TournamentName]: SortOrder.Ascending,
  [SortBy.WinnerName]: SortOrder.Ascending,
  [SortBy.EntrantNum]: SortOrder.Descending,
}
const minRows = 11;

function renderChallonge(challonge?: string) {
  if (!challonge) { return null; }
  const url = challonge.startsWith('https://') ? challonge : `https://challonge.com/${challonge}`;
  return (
    <a target="_blank" rel="noopener noreferrer" href={url}>Bracket</a>
  );
}
function renderYouTube(youtube?: string) {
  if (!youtube) { return null; }
  const url = `https://youtube.com/watch?v=${youtube}`;
  return (
    <a target="_blank" rel="noopener noreferrer" href={url}>YouTube</a>
  );
}
function renderSortIcon(isCurrent: boolean, sortOrder: SortOrder) {
  const sortIcon = isCurrent ? (
    sortOrder === SortOrder.Ascending ? '🔼' : '🔽'
  ) : '⏺️';
  return <div>{sortIcon}</div>;
}

export function Table(props: {
  data?: HallOfFameData;
  view: ViewOption;
  query: string;
}) {
  const [sortBy, setSortBy] = useState<SortBy>(SortBy.Date);
  const [sortOrder, setSortOrder] = useState<SortOrder>(DefaultOrder[sortBy]);

  const updateSort = useCallback((newSortBy: SortBy) => {
    if (newSortBy !== sortBy) {
      setSortBy(newSortBy);
      setSortOrder(DefaultOrder[newSortBy]);
    } else {
      setSortOrder(getNextInArray(sortOrder, [SortOrder.Ascending, SortOrder.Descending]));
    }
  }, [sortBy, sortOrder]);

  if (!props.data) {
    return <div>loading...</div>;
  }

  const { events } = props.data;
  const terms = props.query.toLowerCase().split(' ');
  const filteredByCategory = props.view === ViewAll ? events : events.filter(entry => entry.category === props.view);
  const filteredBySearch = props.query ? filteredByCategory.filter(entry => {
    const toMatch = [entry.name.toLowerCase(), entry.winner.toLowerCase()];
    return terms.every(searchTerm => toMatch.some(data => data.includes(searchTerm)));
  }) : filteredByCategory;
  const filtered = filteredBySearch;

  const sortedAscending = (() => {
    switch (sortBy) {
      case SortBy.Date:
        return sortArrayOfObjects(filtered, entry => entry.date);
      case SortBy.TournamentName:
        return sortArrayOfObjects(filtered, entry => entry.name);
      case SortBy.WinnerName:
        return sortArrayOfObjects(filtered, entry => entry.winner);
      case SortBy.EntrantNum:
        return sortArrayOfObjects(filtered, entry => entry.entrants);
    }
  })();
  const rows: (HallOfFameEntry | undefined)[] = sortOrder === SortOrder.Ascending
    ? sortedAscending
    : sortedAscending.reverse();
  const missingRows = Math.max(0, minRows - rows.length);
  rows.push(...range(missingRows).map(() => undefined));

  return (
    <TableDiv>
      <LeaderboardHeader>
        <FlexRow>
          <DateCell
            isClickable={true}
            onClick={() => updateSort(SortBy.Date)}
          >
            <div><u>Date</u></div>
            {renderSortIcon(sortBy === SortBy.Date, sortOrder)}
          </DateCell>
          <NameCell>
            <u>Tournament</u>
          </NameCell>
          <ChampionCell>
            <u>Champion</u>
          </ChampionCell>
          <EntrantsCell
            isClickable={true}
            onClick={() => updateSort(SortBy.EntrantNum)}
          >
            <div><u>Entrants</u></div>
            {renderSortIcon(sortBy === SortBy.EntrantNum, sortOrder)}
          </EntrantsCell>
          <CategoryCell>
            <u>Type</u>
          </CategoryCell>
          <LinksCell>
            <u>Links</u>
          </LinksCell>
        </FlexRow>
      </LeaderboardHeader>
      <LeaderboardBody>
        {rows.map((row, ri) => row ? (
          <FlexRow key={ri}>
            <DateCell>{row.date}</DateCell>
            <NameCell>{row.name}</NameCell>
            <ChampionCell>{row.winner}</ChampionCell>
            <EntrantsCell>{row.entrants}</EntrantsCell>
            <CategoryCell>{OptionName(row.category)}</CategoryCell>
            <LinksCell>
              {renderChallonge(row.challonge)}
              {renderYouTube(row.youtube)}
            </LinksCell>
          </FlexRow>
        ) : (
          <FlexRow key={ri}>
            <DateCell>&nbsp;</DateCell>
            <NameCell>&nbsp;</NameCell>
            <ChampionCell>&nbsp;</ChampionCell>
            <EntrantsCell>&nbsp;</EntrantsCell>
            <CategoryCell>&nbsp;</CategoryCell>
            <LinksCell>&nbsp;</LinksCell>
          </FlexRow>
        ))}
      </LeaderboardBody>
    </TableDiv>
  );
}
