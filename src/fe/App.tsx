import React from 'react';
import styled from 'styled-components';
import './App.css';
import { Table } from './Table';
import { useEffect, useState } from "react";
import { HallOfFameData, ViewAll, ViewOption } from "../lib/types";
import { DataManager } from '../lib/data';
import { sleep, sortArray } from "../lib/util";
import { Search } from './Search';
import { CONSTANTS } from '../lib/constants';

const StatsTitle = styled.div`
  font-size: 2em;
  margin-top: 1em;
`;
const SmallerText = styled.div`
`;
const SocialInfo = styled(SmallerText)`
  margin-top: 0.5em;
  margin-bottom: 0.8em;
`;

export function App() {
  const [data, setData] = useState<HallOfFameData>();
  const [view, setView] = useState<ViewOption>(ViewAll);
  const [query, setQuery] = useState<string>('');

  useEffect(() => {
    (async () => {
      const dm = new DataManager();
      const data = await dm.fetchEvents();
      await sleep(1000); // todo temp
      setData(data);
    })();
  }, []);

  const updated = (
    data ? sortArray(data.events.map(evt => evt.date)).reverse()[0] : undefined
  ) ?? '???';

  return (
    <div className="App">
      <div>
        <img
          className='Logo'
          src="images/logo.png"
        />
      </div>
      <StatsTitle>The Hall of Fame</StatsTitle>
      <div>
        Here we celebrate and immortalize all of the Tough Love Arena champions
      </div>
      <SmallerText>
        <i>last updated {updated}</i>
      </SmallerText>
      <SocialInfo>
        Want to submit your event to the Hall of Fame?
        Send us an <a href={CONSTANTS.External.Email}>email</a> or message us on <a href={CONSTANTS.External.Twitter}>Twitter</a>
      </SocialInfo>

      <Search
        view={view}
        setView={setView}
        query={query}
        setQuery={setQuery}
      />

      <Table />
    </div>
  );
}
