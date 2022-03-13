import React from 'react';
import styled from 'styled-components';
import { CONSTANTS } from '../lib/constants';
import { HallOfFameEntry, HallOfFameType, HallOfFameData } from '../lib/types';
import { getNextInArray, range, sortArray, sortArrayOfObjects } from '../lib/util';

const StatsTitle = styled.div`
  font-size: 2em;
  margin-top: 1em;
`;

const LeaderboardHeader = styled.div`
  & > * > * {
    padding-left: 0;
  }
`;
const LeaderboardBody = styled.div`
  font-size: 20px;
  & > *:nth-child(odd) {
    background: #202020;
  }
  & > *:hover {
    color: black;
    background-color: var(--heart);
  }
`;

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

const SearchBar = styled.input`
  font-size: 1rem;
  border-radius: 1em;
  width: 10em;

  margin: 1em 0.5em;
  padding: 0.4em 1em;
`;

const SmallerText = styled.div`
`;
const SocialInfo = styled(SmallerText)`
  margin-top: 0.5em;
  margin-bottom: 0.8em;
`;

const ViewAll = 'all';
type ViewOption = typeof ViewAll | HallOfFameType.Official | HallOfFameType.Community;
const Options: ViewOption[] = [ViewAll, HallOfFameType.Official, HallOfFameType.Community];
function OptionName(vo: ViewOption) {
  if (vo === ViewAll) {
    return 'All';
  }
  return {
    [HallOfFameType.Official]: 'Official',
    [HallOfFameType.Community]: 'Community',
  }[vo];
}

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

interface Props {
  data: HallOfFameData;
}
interface State {
  view: ViewOption;
  search: string;
  searchFocused: boolean;
  sortBy: SortBy;
  sortOrder: SortOrder;
}

export class Legacy extends React.Component<Props, State> {
  static Title = 'Hall of Fame';
  state: State = {
    view: ViewAll,
    search: '',
    searchFocused: false,
    sortBy: SortBy.Date,
    sortOrder: DefaultOrder[SortBy.Date],
  };
  private readonly minRows = 11;

  changeView(newView: ViewOption) {
    this.setState({ view: newView, });
  }

  private setSort(sortBy: SortBy) {
    if (sortBy !== this.state.sortBy) {
      this.setState({
        sortBy,
        sortOrder: DefaultOrder[sortBy],
      });
    } else {
      this.setState({
        sortOrder: getNextInArray(this.state.sortOrder, [SortOrder.Ascending, SortOrder.Descending]),
      });
    }
  }

  private renderChallonge(challonge?: string) {
    if (!challonge) { return null; }
    const url = challonge.startsWith('https://') ? challonge : `https://challonge.com/${challonge}`;
    return (
      <a target="_blank" rel="noopener noreferrer" href={url}>Bracket</a>
    );
  }
  private renderYouTube(youtube?: string) {
    if (!youtube) { return null; }
    const url = `https://youtube.com/watch?v=${youtube}`;
    return (
      <a target="_blank" rel="noopener noreferrer" href={url}>YouTube</a>
    );
  }
  private renderSortIcon(isCurrent: boolean) {
    const sortIcon = isCurrent ? (
      this.state.sortOrder === SortOrder.Ascending ? '🔼' : '🔽'
    ) : '⏺️';
    return <div>{sortIcon}</div>;

  }
  private renderTable(events: HallOfFameEntry[]) {
    const { sortBy } = this.state;
    const rows: (HallOfFameEntry | undefined)[] = events.concat();
    const missingRows = Math.max(0, this.minRows - rows.length);
    rows.push(...range(missingRows).map(() => undefined));

    return (
      <div>
        <LeaderboardHeader>
          <FlexRow>
            <DateCell
              isClickable={true}
              onClick={() => this.setSort(SortBy.Date)}
            >
              <div><u>Date</u></div>
              {this.renderSortIcon(sortBy === SortBy.Date)}
            </DateCell>
            <NameCell>
              <u>Tournament</u>
            </NameCell>
            <ChampionCell>
              <u>Champion</u>
            </ChampionCell>
            <EntrantsCell
              isClickable={true}
              onClick={() => this.setSort(SortBy.EntrantNum)}
            >
              <div><u>Entrants</u></div>
              {this.renderSortIcon(sortBy === SortBy.EntrantNum)}
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
                {this.renderChallonge(row.challonge)}
                {this.renderYouTube(row.youtube)}
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
      </div>
    );
  }
  render() {
    const { data } = this.props;
    const {
      view,
      search,
      sortBy,
      sortOrder,
    } = this.state;

    const events = data.events;
    const updated = sortArray(events.map(evt => evt.date)).reverse()[0] ?? '???';

    const terms = search.toLowerCase().split(' ');
    const filteredByCategory = view === ViewAll ? events : events.filter(entry => entry.category === view);
    const filteredBySearch = search ? filteredByCategory.filter(entry => {
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
    const sorted = sortOrder === SortOrder.Ascending ? sortedAscending : sortedAscending.reverse();

    return (
      // <ScrollableArtBackground src={StaticImage.loadBackgroundImage(LIBRARY.Stages.ParkingLot.backgroundSrc).imageUrl}>
      <>
        <StatsTitle>The Hall of Fame</StatsTitle>
        <div>
          Here we celebrate and immortalize all of the Tough Love Arena champions
        </div>
        <SmallerText>
          <i>last updated {updated}</i>
        </SmallerText>
        <OptionSelect>
          {Options.map(vo => (
            <CategorySelect
              key={vo}
              highlight={vo === view}
              onClick={() => this.changeView(vo)}
            >
              {OptionName(vo)}
            </CategorySelect>
          ))}
          <SearchBar
            placeholder="Filter events"
            value={search}
            onChange={e => this.setState({ search: e.target.value, })}
            onFocus={() => this.setState({ searchFocused: true, })}
            onBlur={() => this.setState({ searchFocused: false, })}
          />
        </OptionSelect>
        <SocialInfo>
          Want to submit your event to the Hall of Fame?
          Send us an <a href={CONSTANTS.External.Email}>email</a> or message us on <a href={CONSTANTS.External.Twitter}>Twitter</a>
        </SocialInfo>
        <br />
        {this.renderTable(sorted)}
      </>
    );
  }
}
