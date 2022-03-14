import { useCallback, useState } from "react";
import styled from 'styled-components';
import { HallOfFameData, HallOfFameEntry, OptionName, ViewAll, ViewOption } from "../lib/types";
import { getNextInArray, sortArrayOfObjects } from "../lib/util";
import { Spinner } from "./Spinner";
import { CONSTANTS } from '../lib/constants';

const TableDiv = styled.div`
  ${CONSTANTS.isMobile ? `
    font-size: 14px;
    width: 100%;
  ` : `
    font-size: 20px;
  `}
`;
const LeaderboardHeader = styled.div`
  ${CONSTANTS.isMobile ? `
    font-size: 20px;
  ` : `
  `}
  & > * > * {
    padding-left: 0;
  }
`;
const LeaderboardBody = styled.div`
  a {
    color: white;
  }
  & > *:nth-child(odd) {
    background: rgba(80, 80, 80, 0.5);
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
const EntrantsHeaderCell = styled(NormalCell)`
  width: 6em;
`;
const EntrantsBodyCell = styled(EntrantsHeaderCell)`
  justify-content: flex-end;
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
const MobileInfoCell = styled(NormalCell)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;

  flex-grow: 1;

  & > * {
    margin: 0.3em 0;
  }
`;
const MobileEntrantsCell = styled(NormalCell)`
  width: auto;
  justify-content: flex-end;
  padding-right: 1em;
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

function MobileLinkable(props: {
  event: HallOfFameEntry;
  children: JSX.Element;
}) {
  const { event } = props;
  function getChallongeUrl(challonge: string) {
    return challonge.startsWith('https://') ? challonge : `https://challonge.com/${challonge}`;
  }
  const url = (
    (event.youtube && `https://youtube.com/watch?v=${event.youtube}`) ||
    (event.challonge && getChallongeUrl(event.challonge)) ||
    undefined
  );

  if (url) {
    return (
      <a href={url}>
        {props.children}
      </a>
    );
  }
  return props.children;
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
    return <Spinner height="10em" />;
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
  const rows = sortOrder === SortOrder.Ascending
    ? sortedAscending
    : sortedAscending.reverse();

  if (CONSTANTS.isMobile) {
    return (
      <TableDiv>
        <LeaderboardHeader>
          <FlexRow>
            <DateCell
              isClickable={true}
              onClick={() => updateSort(SortBy.Date)}
            >
              <div><u>Date</u></div>
            </DateCell>
            <MobileInfoCell>
              <div>
                Tournament Info
              </div>
            </MobileInfoCell>
            <MobileEntrantsCell
              isClickable={true}
              onClick={() => updateSort(SortBy.EntrantNum)}
            >
              <div><u>#</u></div>
            </MobileEntrantsCell>
          </FlexRow>
        </LeaderboardHeader>
        <LeaderboardBody>
          {rows.map((row, ri) => (
            <FlexRow key={ri}>
              <DateCell>{row.date}</DateCell>
              <MobileInfoCell>
                <MobileLinkable event={row}>
                  <div>
                    {row.name}
                  </div>
                </MobileLinkable>
                <div>
                  {row.winner}
                </div>
              </MobileInfoCell>
              <MobileEntrantsCell>{row.entrants}</MobileEntrantsCell>
            </FlexRow>
          ))}
        </LeaderboardBody>
      </TableDiv>);
  }

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
          <EntrantsHeaderCell
            isClickable={true}
            onClick={() => updateSort(SortBy.EntrantNum)}
          >
            <div><u>Entrants</u></div>
            {renderSortIcon(sortBy === SortBy.EntrantNum, sortOrder)}
          </EntrantsHeaderCell>
          <CategoryCell>
            <u>Type</u>
          </CategoryCell>
          <LinksCell>
            <u>Links</u>
          </LinksCell>
        </FlexRow>
      </LeaderboardHeader>
      <LeaderboardBody>
        {rows.map((row, ri) => (
          <FlexRow key={ri}>
            <DateCell>{row.date}</DateCell>
            <NameCell>{row.name}</NameCell>
            <ChampionCell>{row.winner}</ChampionCell>
            <EntrantsBodyCell>{row.entrants}</EntrantsBodyCell>
            <CategoryCell>{OptionName(row.category)}</CategoryCell>
            <LinksCell>
              {renderChallonge(row.challonge)}
              {renderYouTube(row.youtube)}
            </LinksCell>
          </FlexRow>
        ))}
      </LeaderboardBody>
    </TableDiv>
  );
}
