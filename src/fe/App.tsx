import React from 'react';
import styled from 'styled-components';
import { Table } from './Table';
import { useEffect, useState } from "react";
import { HallOfFameData, ViewAll, ViewOption } from "../lib/types";
import { DataManager } from '../lib/data';
import { sleep, sortArray } from "../lib/util";
import { Search } from './Search';
import { CONSTANTS } from '../lib/constants';

const AppDiv = styled.div`
  padding: 1em;

  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
`;

const Header = styled.div`
  max-width: 800px;
  text-align: center;
`;

const Logo = styled.img`
  width: 600px;
  height: auto;
`;

const StatsTitle = styled.div`
  font-size: 3em;
`;
const SubTitle = styled.div`
  font-size: 1.5em;
`;
const Updated = styled.div`
  width: 100%;
  text-align: right;
  font-style: italic;
`;
const SocialInfo = styled.div`
  font-size: 1.2em;

  a {
    color: var(--heart);
  }
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
    <AppDiv>
      <Header>
        <div>
          <Logo
            src="images/logo.png"
            alt="Tough Love Arena"
          />
        </div>
        <StatsTitle>The Hall of Fame</StatsTitle>
        <Updated>
          last updated {updated}
        </Updated>
        <SubTitle>
          Here we celebrate and immortalize all of the Tough Love Arena champions
        </SubTitle>
        <SocialInfo>
          Want to submit your event to the Hall of Fame?
          Send us an <a href={CONSTANTS.External.Email}>email</a> or message us on <a href={CONSTANTS.External.Twitter}>Twitter</a>
        </SocialInfo>
      </Header>

      <Search
        view={view}
        query={query}
        setView={setView}
        setQuery={setQuery}
      />

      <Table
        data={data}
        view={view}
        query={query}
      />
    </AppDiv>
  );
}
